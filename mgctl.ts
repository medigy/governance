import {
  docopt,
  govnData as gd,
  govnDataCLI as gdctl,
  govnSvcHealth as gsh,
  govnSvcVersion as gsv,
  httpServer as http,
  nihLhcForms as lf,
  oakHelpers as oakH,
  path,
} from "./deps.ts";
import * as server from "./server.ts";
import * as mod from "./mod.ts";

export async function determineVersion(importMetaURL: string): Promise<string> {
  return gsv.determineVersionFromRepoTag(
    importMetaURL,
    { repoIdentity: "medigy/governance" },
  );
}

const $VERSION = await determineVersion(import.meta.url);
const docoptSpec = `
Medigy Governance Controller ${$VERSION}.

Usage:
  mgctl server [--port=<port>] [--verbose]
  mgctl offering-profile type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl offering-profile inspect lform <lform-json-src>
  mgctl institution-profile type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl quant-eval type lform <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose] [--gd-mod-ref=<path>] [--gd-mod-deps=<deps.ts>]
  mgctl quant-eval type facet <lform-json-src> [--validate] [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--dry-run] [--overwrite] [--verbose]
  mgctl quant-eval type campaigns <start-path> <lform-json-src> [--mg-mod-ref=<path>] [--mg-mod-deps=<deps.ts>] [--verbose] [--overwrite]
  mgctl -h | --help
  mgctl --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lform-json-src>            LHC Form JSON source(s) glob (like "**/*.lhc-form.json") or "-" for STDIN
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
  { "--gd-mod-ref": moduleRef, "--gd-mod-deps": depsTs }: docopt.DocOptions,
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
  { "--mg-mod-ref": moduleRef, "--mg-mod-deps": depsTs }: docopt.DocOptions,
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

export async function inspectLhcFormJSON<F extends lf.NihLhcForm>(
  ctx: gd.CliCmdHandlerContext,
  inspector: {
    inspect: (f: F) => Promise<lf.LhcFormInspectionDiagnostics<F>>;
    inspectionDiagnosticsJSON?: (
      diags: lf.LhcFormInspectionDiagnostics<F>,
    ) => string;
  },
): Promise<void> {
  const { "<lform-json-src>": lformJsonSpec } = ctx.cliOptions;
  if (lformJsonSpec == "-") {
    const supplier = new gd.BufferSupplier(
      Deno.readAllSync(Deno.stdin),
      gd.defaultBufferSupplierOptions("STDIN"),
    );
    supplier.forEach({
      onEntry: async (
        ctx: gd.UntypedDataSupplierEntryContext,
      ): Promise<void> => {
        if (gd.isJsonSupplierEntryContext(ctx)) {
          // TODO: should we "type" this first and not just cast it?
          const lform: F = ctx.jsonValue as F;
          const diags = await inspector.inspect(lform);
          console.log(
            inspector.inspectionDiagnosticsJSON
              ? inspector.inspectionDiagnosticsJSON(diags)
              : JSON.stringify(diags, undefined, 2),
          );
        }
      },
    });
  } else {
    const supplier = new gd.FileSystemGlobSupplier(
      lformJsonSpec?.toString() || "**/*.json",
    );
    supplier.forEach({
      onEntry: async (
        ctx: gd.UntypedDataSupplierEntryContext,
      ): Promise<void> => {
        if (
          gd.isJsonSupplierEntryContext(ctx) && gd.isGlobWalkEntryContext(ctx)
        ) {
          // TODO: should we "type" this first and not just cast it?
          const lform: F = ctx.jsonValue as F;
          const diags = await inspector.inspect(lform);
          Deno.writeTextFileSync(
            `${ctx.fileNameWithoutExtn}.inspection-log.json`,
            inspector.inspectionDiagnosticsJSON
              ? inspector.inspectionDiagnosticsJSON(diags)
              : JSON.stringify(diags, undefined, 2),
          );
        }
      },
    });
  }
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

export async function offeringProfileLhcFormInspectCliHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "offering-profile": offeringProfile,
    "inspect": inspect,
    "lform": lform,
    "<lform-json-src>": lformJsonSpec,
  } = ctx.cliOptions;
  if (offeringProfile && inspect && lform && lformJsonSpec) {
    inspectLhcFormJSON<mod.offerProfile.lf.OfferingProfileLhcForm>(
      ctx,
      new mod.offerProfile.lf.OfferingProfileValidator(),
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

export async function httpServiceHandler(
  ctx: gd.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "server": isServer,
    "--port": portSpec,
  } = ctx.cliOptions;
  if (isServer) {
    const port = typeof portSpec === "number" ? portSpec : 8159;

    /* TODO: Pass the proper parameters to the server.httpServiceRouter() function
     */
    const app = server.httpServer({
      port: port,
      router: server.httpServiceRouter(),
    });
    oakH.registerHealthRoute(app, {
      serviceVersion: () => {
        return $VERSION;
      },
      /* TODO: IF more details to be checked in the end point need to give that after the releaseID */
      endpoint: async () => {
        const hs = gsh.healthyService({
          version: "1",
          releaseID: $VERSION,
        });
        return gsh.healthStatusEndpoint(hs);
      },
    });
    await app.listen({ port: port });
    return true;
  }
}

if (import.meta.main) {
  gdctl.CLI<gd.CliCmdHandlerContext>(
    docoptSpec,
    [
      offeringProfileLhcFormJsonTyperCliHandler,
      offeringProfileLhcFormInspectCliHandler,
      institutionProfileLhcFormJsonTyperCliHandler,
      quantEvalFacetLhcFormJsonTyperCliHandler,
      quantEvalFacetTyperCliHandler,
      quantEvalCampaignsTyperCliHandler,
      httpServiceHandler,
    ],
    (options: docopt.DocOptions): gd.CliCmdHandlerContext => {
      return new gd.CliCmdHandlerContext(
        import.meta.url,
        options,
        gd.defaultTypicalControllerOptions({ cli: "NO DATA INSTANCE" }),
      );
    },
  );
}
