import { govnData as gd, govnDataCLI as gdctl, path } from "./deps.ts";
import * as mod from "./mod.ts";

const $VERSION = gdctl.determineVersion(import.meta.url, import.meta.main);
const docoptSpec = `
Medigy Governance Controller ${$VERSION}.

Usage:
  mgctl offering-profile type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl institution-profile type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl quant-eval type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl quant-eval type facet <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose]
  mgctl quant-eval type campaigns <start-path> <lform-json-src> [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--verbose] [--overwrite]
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

export async function institutionProfileLhcFormJsonTyperCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "institution-profile": institutionProfile,
    "type": type,
    "lform": lform,
    "<lform-json-src>": lformJsonSpec,
  } = ctx.cliOptions;
  if (institutionProfile && type && lform && lformJsonSpec) {
    typeLhcFormJSON(
      ctx,
      new mod.instiProfile.lf.InstitutionProfileLhcFormJsonTyper({
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

export async function quantEvalFacetTyperCliHandler(
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

export async function quantEvalCampaignsTyperCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "quant-eval": quantEval,
    "type": type,
    "campaigns": campaigns,
    "<start-path>": startPathSpec,
    "<lform-json-src>": lhcFormJsonSrcSpec,
  } = ctx.cliOptions;
  if (quantEval && type && campaigns && startPathSpec && lhcFormJsonSrcSpec) {
    mod.quantEval.EvaluationFacetCampaignsTyper({
      ...medigyGovnModuleRef(ctx.cliOptions),
      startPath: startPathSpec.toString(),
      lhcFormJsonSrcSpec: lhcFormJsonSrcSpec.toString(),
      overwrite: ctx.shouldOverwrite,
      verbose: ctx.isVerbose,
    });
    return true;
  }
}

if (import.meta.main) {
  gdctl.CLI<gd.CliCmdHandlerContext>(
    docoptSpec,
    [
      offeringProfileLhcFormJsonTyperCliHandler,
      institutionProfileLhcFormJsonTyperCliHandler,
      quantEvalFacetLhcFormJsonTyperCliHandler,
      quantEvalFacetTyperCliHandler,
      quantEvalCampaignsTyperCliHandler,
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
