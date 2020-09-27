import {
  govnData as gd,
  govnDataCLI as gdctl,
  inflect,
  nihLhcForms as lform,
  path,
  fs,
} from "./deps.ts";

const $VERSION = gdctl.determineVersion(import.meta.url, import.meta.main);
const docoptSpec = `
Medigy Governance Controller ${$VERSION}.

Usage:
  mgctl lform type <lform-json-src> [--dry-run] [--overwrite] [--validate] [--verbose] [--deps=<deps.ts>]
  mgctl lform eval-facets <lform-json-src> [--verbose] [--overwrite] [--deps=<deps.ts>]
  mgctl lform campaigns <start-path> <lform-json-src> [--verbose] [--overwrite] [--deps=<deps.ts>]
  mgctl -h | --help
  mgctl --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lform-json-src>            LHC Form JSON source(s) glob (like "**/*.lhc-form.json")
  <start-path>                Starting path to search for LHC Form JSON sources
  --validate                  Check the generated TypeScript file(s)
  --deps=<file.ts>            Where the deps.ts file is found (default: "../../deps.ts")
  --persist-on-error          Saves the generated *.auto.ts file on error
  --verbose                   Be explicit about what's going on
`;

export function validateEmitted(result: gd.StructuredDataTyperResult): void {
  if (gd.isFileDestinationResult(result)) {
    const destRel = "." + path.SEP + result.destFileNameRel(Deno.cwd());
    console.log(
      `Using Deno dynamic import("${destRel}") to validate...`,
    );
    // deno-lint-ignore no-undef
    import(destRel);
  }
}

export class LhcFormJsonTyper extends gd.TypicalJsonTyper {
  constructor({ "--deps": depsTs }: gdctl.docopt.DocOptions) {
    super(gd.defaultTypicalJsonTyperOptions(
      [
        `import { nihLhcForms as mod, govnData } from "${
          depsTs ? depsTs.toString() : "./deps.ts"
        }";`,
      ],
      "NihLhcForm",
      { instanceName: "form", emittedFileExtn: ".lhc-form.auto.ts" },
    ));
  }
}

export class LhcFormEvalFacetTyper extends lform.LhcFormContainer {
  readonly depsTs: string;

  static facetClassName(fileNameIV: inflect.InflectableValue): string {
    return gd.typeScriptClassName(
      fileNameIV,
      { forceSuffix: "Facet", removeSuffixes: ["EvaluationFacet"] },
    );
  }

  constructor({ "--deps": depsTs }: gdctl.docopt.DocOptions) {
    super();
    this.depsTs = depsTs ? depsTs.toString() : "./deps.ts";
  }

  className(fileNameIV: inflect.InflectableValue, fc: gd.FileContext): string {
    return LhcFormEvalFacetTyper.facetClassName(fileNameIV);
  }

  protected typerContent(
    ctx: gd.JsonTyperContext,
    fc: gd.FileContext,
  ): string {
    const iv = inflect.guessCaseValue(fc.fileNameWithoutExtn);
    const className = this.className(iv, fc);
    const lhcFormModuleRel = path.relative(
      path.dirname(this.destFileName(fc)),
      fc.forceExtension(".lhc-form.auto.ts"),
    );
    return `
    import { medigyGovn as mg } from "${this.depsTs}";
    import lhcFormJsonModule from "./${lhcFormModuleRel}";

    // deno-lint-ignore no-empty-interface
    export interface ${className}ConstructionContext extends mg.quantEval.EvalFacetConstructionContext {}

    export class ${className} extends mg.quantEval.EvaluationFacet {
      constructor(ctx?: ${className}ConstructionContext) {
        super({ ...ctx, nihlhcForm: lhcFormJsonModule });
      }
    }

    export default ${className};
    `.replaceAll(/^ {8}/gm, ""); // remove indendation
  }
}

export async function lhcFormJsonTyperCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "lform": json,
    "type": type,
    "<lform-json-src>": lformJsonSpec,
    "--validate": validate,
  } = ctx.cliOptions;
  if (json && type && lformJsonSpec) {
    const ctl = new gd.TypicalController(
      ctx.calledFromMetaURL,
      {
        ...ctx.tco,
        defaultJsonExtn: ".lch-form.auto.json",
        onAfterEmit: (result: gd.StructuredDataTyperResult): void => {
          if (validate && !ctx.isDryRun) validateEmitted(result);
        },
      },
    );
    ctl.jsonType({
      jsonSrcSpec: lformJsonSpec?.toString() || "**/*.json",
      typer: new LhcFormJsonTyper(ctx.cliOptions),
      verbose: ctx.isVerbose || ctx.isDryRun,
      overwrite: ctx.shouldOverwrite,
    });
    return true;
  }
}

export async function lhcFormEvalFacetCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "lform": json,
    "eval-facets": evalFacets,
    "<lform-json-src>": lformJsonSpec,
    "--validate": validate,
  } = ctx.cliOptions;
  if (json && evalFacets && lformJsonSpec) {
    const emitter = new gd.TypedDataFileSystemEmitter(
      [new LhcFormEvalFacetTyper(ctx.cliOptions)],
    );
    emitter.emitTypedData({
      udSupplier: new gd.FileSystemGlobSupplier(lformJsonSpec.toString()),
      shouldEmit: gd.shouldEmitCheckOverwriteAndNotDryRun(
        ctx.shouldOverwrite,
        ctx.isDryRun,
        ctx.isVerbose,
      ),
      onAfterEmit: (result: gd.StructuredDataTyperResult): void => {
        if (gd.isFileDestinationResult(result)) {
          const destRel = "." + path.SEP + result.destFileNameRel(Deno.cwd());
          if (ctx.isVerbose && !ctx.isDryRun) {
            console.log(destRel);
          }
          if (validate && !ctx.isDryRun) {
            validateEmitted(result);
          }
        }
      },
    });
    return true;
  }
}

export async function lhcFormsToCampaigns(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "lform": lform,
    "campaigns": campaigns,
    "<start-path>": startPathSpec,
    "<lhc-json-src>": lhcFormJsonSrcSpec,
    "--deps": depsTs,
  } = ctx.cliOptions;
  if (lform && campaigns && startPathSpec) {
    const verbose = ctx.isVerbose;
    const overwrite = ctx.shouldOverwrite;
    const pathSpec = startPathSpec.toString();
    if (!fs.existsSync(pathSpec)) {
      console.error(`${pathSpec} does not exist.`);
      return true;
    }
    const stat = Deno.statSync(pathSpec);
    if (!stat.isDirectory) {
      console.error(`${pathSpec} is not a directory.`);
      return true;
    }

    for (const dirWE of fs.walkSync(pathSpec)) {
      if (dirWE.isDirectory) {
        const dirIV = inflect.guessCaseValue(dirWE.name);
        const facetsMgrFileName = path.join(
          dirWE.path,
          `${inflect.toKebabCase(dirIV)}-facets.ts`,
        );
        const facetsMgrClassName = inflect.toPascalCase(dirIV) + "Facets";
        const modFileName = path.join(dirWE.path, "mod.ts");
        if (fs.existsSync(modFileName) && !overwrite) {
          console.warn(
            `${modFileName} exists, use --overwrite to replace it.`,
          );
          continue;
        }

        const imports: string[] = [];
        const exports: string[] = [];
        const instanceDecls: string[] = [];
        const instanceAssgns: string[] = [];
        const instanceRegisters: string[] = [];
        const facets: string[] = [];
        const jsonSpec = path.join(
          dirWE.path,
          lhcFormJsonSrcSpec
            ? lhcFormJsonSrcSpec.toString()
            : "*.lhc-form.json",
        );
        for (const we of fs.expandGlobSync(jsonSpec)) {
          if (
            dirWE.path != path.dirname(path.relative(pathSpec, we.path))
          ) {
            continue;
          }
          const gweCtx = gd.FileSystemGlobSupplier.globWalkEntryContext(we);
          const formIV = inflect.guessCaseValue(gweCtx.fileNameWithoutExtn);
          const className = LhcFormEvalFacetTyper.facetClassName(formIV);
          imports.push(
            `import { ${className} } from "./${gweCtx.fileNameWithoutExtn}.ts";`,
          );
          instanceDecls.push(
            `  readonly ${inflect.toCamelCase(formIV)}: ${className};`,
          );
          instanceAssgns.push(
            `  this.${inflect.toCamelCase(formIV)} = new ${className}();`,
          );
          instanceRegisters.push(
            `  this.instruments.push(this.${inflect.toCamelCase(formIV)});`,
          );
          exports.push(
            `export * as ${
              inflect.toCamelCase(formIV)
            } from "./${gweCtx.fileNameWithoutExtn}.ts";`,
          );
          facets.push(className);
        }
        if (imports.length > 0) {
          const managerCode = `
          import { medigyGovn as mg } from "${depsTs}";

          ${imports.join("\n")}

          // deno-lint-ignore no-empty-interface
          export interface ${facetsMgrClassName}ConstructionContext extends mg.quantEval.EvalFacetsConstructionContext {}

          export class ${facetsMgrClassName} extends mg.quantEval.EvaluationFacets {
            static readonly facets: readonly mg.quantEval.EvalFacetConstructor[] = [
              ${facets.join(", ")}
            ];
            ${instanceDecls.join("\n")}

            constructor(ctx: ${facetsMgrClassName}ConstructionContext) {
              super({ ...ctx,
                identity: "${inflect.toHumanCase(dirIV)}",
                path: ctx.path.childPath("${dirWE.name}"),
              });
              ${instanceAssgns.join("\n")}
              ${instanceRegisters.join("\n")}
            }
          }

          export default ${facetsMgrClassName};
          `;
          exports.push(
            `export * from "./${path.basename(facetsMgrFileName)}";`,
          );
          Deno.writeTextFileSync(facetsMgrFileName, managerCode);
          Deno.writeTextFileSync(modFileName, exports.join("\n"));
          if (verbose) console.log(modFileName);
        } else {
          if (verbose) {
            console.log(
              `No LHC Form JSON files in ${dirWE.path}, ${facetsMgrFileName} and ${modFileName} not created.`,
            );
          }
        }
      }
    }
    return true;
  }
}

if (import.meta.main) {
  gdctl.CLI<gd.CliCmdHandlerContext>(
    docoptSpec,
    [
      lhcFormJsonTyperCliHandler,
      lhcFormEvalFacetCliHandler,
      lhcFormsToCampaigns,
    ],
    (options: gdctl.docopt.DocOptions): gd.CliCmdHandlerContext => {
      return new gd.CliCmdHandlerContext(
        import.meta.url,
        options,
        gd.defaultTypicalControllerOptions({ cli: "NO DATA INSTANCE" }),
      );
    },
  );
}
