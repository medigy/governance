import {
  govnData as gd,
  govnDataCLI as gdctl,
  inflect,
  nihLhcForms as lform,
  path,
  fs,
} from "./deps.ts";
import * as mod from "./mod.ts";

const $VERSION = gdctl.determineVersion(import.meta.url, import.meta.main);
const docoptSpec = `
Medigy Governance Controller ${$VERSION}.

Usage:
  mgctl offering-profile type <lform-json-src> [--validate] [--mg-home=<path>] [--mg-version=<semver>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl lform type <lform-json-src> [--dry-run] [--overwrite] [--validate] [--verbose] [--deps=<deps.ts>]
  mgctl lform eval-facets <lform-json-src> [--verbose] [--overwrite] [--deps=<deps.ts>]
  mgctl lform eval-facet-campaigns <start-path> <lform-json-src> [--verbose] [--overwrite] [--deps=<deps.ts>]
  mgctl -h | --help
  mgctl --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lform-json-src>            LHC Form JSON source(s) glob (like "**/*.lhc-form.json")
  <start-path>                Starting path to search for LHC Form JSON sources
  --validate                  Check the generated TypeScript file(s)
  --mg-home=<path>            Absolute or relative path of the Medigy Governance library
  --mg-version=<semver>       Version of Medigy Governance schemas to use (ignored if --mg-home provided)
  --gd-mod-ref=<path>         Absolute or relative path of the GovSuite GSD module to use
  --gd-mod-deps=<deps.ts>     Relative path to the deps.ts file for access GovSuite GSD 'govnData' module (ignored if --gd-mod-ref provided)
  --persist-on-error          Saves the generated *.auto.ts file on error
  --overwrite                 Replace files in case they already exist
  --dry-run                   Only show what will be done, without executing
  --verbose                   Be explicit about what's going on
`;

export function govnDataModuleImportDirective(
  { "--gd-mod-ref": moduleRef, "--gd-mod-deps": depsTs }:
    gdctl.docopt.DocOptions,
): { govnDataModuleRef: string; govnDataModuleImportDirective: string } {
  return {
    govnDataModuleRef: moduleRef
      ? moduleRef.toString()
      : "https://denopkg.com/gov-suite/governed-structured-data/mod.ts",
    govnDataModuleImportDirective: moduleRef
      ? `import * as govnData from "${moduleRef}";`
      : `import { govnData } from "${
        depsTs ? depsTs.toString() : "./deps.ts"
      }";`,
  };
}

export function medigyGovnModuleRef(
  { "--mg-home": medigyGovnHome, "--mg-version": medigyGovnSemVer }:
    gdctl.docopt.DocOptions,
): { medigyGovnModuleRef: string } {
  return {
    medigyGovnModuleRef: medigyGovnHome
      ? medigyGovnHome.toString()
      : `https://denopkg.com/medigy/governance${
        medigyGovnSemVer ? `@${medigyGovnSemVer.toString()}` : ""
      }`,
  };
}

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
        `import { nihLhcForms as lform, govnData } from "${
          depsTs ? depsTs.toString() : "./deps.ts"
        }";`,
      ],
      "lform.NihLhcForm",
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

export async function offeringProfileLhcFormJsonTyperCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "offering-profile": offeringProfile,
    "type": type,
    "<lform-json-src>": lformJsonSpec,
    "--validate": validate,
  } = ctx.cliOptions;
  if (offeringProfile && type && lformJsonSpec) {
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
      typer: new mod.offerProfile.lf.OfferingProfileLhcFormJsonTyper({
        ...govnDataModuleImportDirective(ctx.cliOptions),
        ...medigyGovnModuleRef(ctx.cliOptions),
      }),
      verbose: ctx.isVerbose || ctx.isDryRun,
      overwrite: ctx.shouldOverwrite,
    });
    return true;
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

export async function lhcFormsToEvalFacetCampaignsCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "lform": lform,
    "eval-facet-campaigns": campaigns,
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
      offeringProfileLhcFormJsonTyperCliHandler,
      lhcFormJsonTyperCliHandler,
      lhcFormEvalFacetCliHandler,
      lhcFormsToEvalFacetCampaignsCliHandler,
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
