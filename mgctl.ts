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
  mgctl offering-profile type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl quant-eval type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl quant-eval type facet <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose]
  mgctl quant-eval type campaigns <start-path> <lform-json-src> [--verbose] [--overwrite] [--deps=<deps.ts>]
  mgctl -h | --help
  mgctl --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lform-json-src>            LHC Form JSON source(s) glob (like "**/*.lhc-form.json")
  <start-path>                Starting path to search for LHC Form JSON sources
  --validate                  Check the generated TypeScript file(s)
  --mg-mod-ref=<path>         Absolute or relative path of the Medigy Governance *.mod.ts to use
  --mg-mod-deps=<deps.ts>     Relative path to the deps.ts file which includes reference to '{ medigyGovn }' (ignored if --mg-mod-ref provided)
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
): {
  govnDataModuleRef: string;
  govnDataModuleImportDirective: string;
  govnDataModuleTypeImportDirective: string;
} {
  return {
    govnDataModuleRef: moduleRef
      ? moduleRef.toString()
      : "https://denopkg.com/gov-suite/governed-structured-data/mod.ts",
    govnDataModuleImportDirective: moduleRef
      ? `import * as govnData from "${moduleRef}";`
      : `import { govnData } from "${
        depsTs ? depsTs.toString() : "./deps.ts"
      }";`,
    govnDataModuleTypeImportDirective: moduleRef
      ? `import type * as govnData from "${moduleRef}";`
      : `import type { govnData } from "${
        depsTs ? depsTs.toString() : "./deps.ts"
      }";`,
  };
}

export function medigyGovnModuleRef(
  { "--mg-mod-ref": moduleRef, "--mg-mod-deps": depsTs }:
    gdctl.docopt.DocOptions,
): {
  medigyGovnModuleImportDirective: string;
  medigyGovnModuleTypeImportDirective: string;
  medigyGovnModuleRef: string;
} {
  return {
    medigyGovnModuleRef: moduleRef
      ? moduleRef.toString()
      : "https://denopkg.com/medigy/governance/mod.ts",
    medigyGovnModuleImportDirective: moduleRef
      ? `import * as medigyGovn from "${moduleRef}";`
      : `import { medigyGovn } from "${
        depsTs ? depsTs.toString() : "./deps.ts"
      }";`,
    medigyGovnModuleTypeImportDirective: moduleRef
      ? `import type * as medigyGovn from "${moduleRef}";`
      : `import type { medigyGovn } from "${
        depsTs ? depsTs.toString() : "./deps.ts"
      }";`,
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

export async function typeLhcFormJSON(
  ctx: gd.CliCmdHandlerContext,
  typer: gd.TypicalJsonTyper,
): Promise<void> {
  const {
    "<lform-json-src>": lformJsonSpec,
    "--validate": validate,
  } = ctx.cliOptions;
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
    typer: typer,
    verbose: ctx.isVerbose || ctx.isDryRun,
    overwrite: ctx.shouldOverwrite,
  });
}

export async function offeringProfileLhcFormJsonTyperCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "offering-profile": offeringProfile,
    "type": type,
    "lform": lform,
    "<lform-json-src>": lformJsonSpec,
  } = ctx.cliOptions;
  if (offeringProfile && type && lform && lformJsonSpec) {
    typeLhcFormJSON(
      ctx,
      new mod.offerProfile.lf.OfferingProfileLhcFormJsonTyper({
        ...govnDataModuleImportDirective(ctx.cliOptions),
        ...medigyGovnModuleRef(ctx.cliOptions),
      }),
    );
    return true;
  }
}

export async function quantEvalFacetLhcFormJsonTyperCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "quant-eval": quantEval,
    "type": type,
    "lform": lform,
    "<lform-json-src>": lformJsonSpec,
  } = ctx.cliOptions;
  if (quantEval && type && lform && lformJsonSpec) {
    typeLhcFormJSON(
      ctx,
      new mod.quantEval.lf.QuantEvalFacetLhcFormJsonTyper({
        ...govnDataModuleImportDirective(ctx.cliOptions),
        ...medigyGovnModuleRef(ctx.cliOptions),
      }),
    );
    return true;
  }
}

export async function lhcFormEvalFacetCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "quant-eval": quantEval,
    "type": type,
    "facet": facet,
    "<lform-json-src>": lformJsonSpec,
    "--validate": validate,
  } = ctx.cliOptions;
  if (quantEval && type && facet && lformJsonSpec) {
    const emitter = new gd.TypedDataFileSystemEmitter(
      [
        new mod.quantEval.EvaluationFacetTyper(
          medigyGovnModuleRef(ctx.cliOptions),
        ),
      ],
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
          const className = mod.quantEval.EvaluationFacetTyper.facetClassName(
            formIV,
          );
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
      quantEvalFacetLhcFormJsonTyperCliHandler,
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
