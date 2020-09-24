import * as cli from "../cli.ts";
import * as code from "../code.ts";
import {
  docopt,
  fs,
  inflect,
  path,
  serializeJS as sjs,
  typedDataGen as tdg,
} from "./deps.ts";

const $VERSION = cli.determineVersion(import.meta.url, import.meta.main);
const docoptSpec = `
Medigy Quantitative Evaluation Facets Controller ${$VERSION}.

Usage:
  facetsctl json-to-campaigns <start-path> <lhc-json-src> [--verbose] [--overwrite] [--deps=<deps.ts>] [--deps-test-ts=<deps-test.ts>]
  facetsctl json-to-qe-facet <lhc-json-src> [--verbose] [--overwrite] [--deps=<deps.ts>] [--deps-test-ts=<deps-test.ts>]
  facetsctl json-to-typed-data <lhc-json-src> [--verbose] [--deps=<deps.ts>] [--deps-test-ts=<deps-test.ts>]
  facetsctl -h | --help
  facetsctl --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lhc-json-src>              LHC Form JSON source(s) glob (like "**/*.lhc-form.json")
  <start-path>                Starting path to search for LHC Form JSON sources
  --lform-schema-ts=<url>     Where the lform.ts TypeScript schema can be found
  --deps=<file.ts>            Where the deps.ts file is found (default: "../../deps.ts")
  --deps-test=<file.ts>       Where the deps.ts file is found (default: "../../deps-test.ts")
  --persist-on-error          Saves the generated *.auto.ts file on error
  --verbose                   Be explicit about what's going on
`;

export function facetClassName(fileName: inflect.InflectableValue): string {
  return code.typeScriptClassName(
    fileName,
    { forceSuffix: "Facet", removeSuffixes: ["EvaluationFacet"] },
  );
}

export function deps(options: docopt.DocOptions): [string, string] {
  const {
    "--deps": depsTs,
    "--deps-test": depsTestTs,
  } = options;
  return [
    depsTs ? depsTs.toString() : "./deps.ts",
    depsTestTs ? depsTestTs.toString() : "./deps-test.ts",
  ];
}

export async function lhcFormsToCampaigns(
  options: docopt.DocOptions,
): Promise<true | void> {
  const {
    "json-to-campaigns": jsonToMod,
    "<start-path>": startPathSpec,
    "<lhc-json-src>": lhcFormJsonSrcSpec,
  } = options;
  if (jsonToMod && startPathSpec) {
    const verbose = cli.isVerbose(options);
    const overwrite = cli.overwrite(options);
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
    const [depsTs, depsTestTs] = deps(options);

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
          const fnc = cli.fileNameComponents(we.name);
          const formIV = inflect.guessCaseValue(fnc.name);
          const className = facetClassName(formIV);
          imports.push(`import { ${className} } from "./${fnc.name}.ts";`);
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
            } from "./${fnc.name}.ts";`,
          );
          facets.push(className);
        }
        if (imports.length > 0) {
          const managerCode = `
          import { medigyGovnQE } from "${depsTs}";
          
          ${imports.join("\n")}
          
          // deno-lint-ignore no-empty-interface
          export interface ${facetsMgrClassName}ConstructionContext extends medigyGovnQE.EvalFacetsConstructionContext {}

          export class ${facetsMgrClassName} extends medigyGovnQE.EvaluationFacets {
            static readonly facets: readonly medigyGovnQE.EvalFacetConstructor[] = [
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

export async function lhcFormJsonToQualEvalFacet(
  options: docopt.DocOptions,
): Promise<true | void> {
  const {
    "json-to-qe-facet": jsonToGAI,
    "<lhc-json-src>": lhcFormJsonSrcSpec,
  } = options;
  if (jsonToGAI && lhcFormJsonSrcSpec) {
    const verbose = cli.isVerbose(options);
    const overwrite = cli.overwrite(options);
    const sourceSpec = lhcFormJsonSrcSpec.toString();
    const [depsTs, depsTestTs] = deps(options);
    for (const we of fs.expandGlobSync(sourceSpec)) {
      const fnc = cli.fileNameComponents(we.name);
      const tsGenFileName = cli.forceExtension(".ts", we, fnc);
      if (fs.existsSync(tsGenFileName) && !overwrite) {
        console.warn(
          `${tsGenFileName} exists, use --overwrite to replace it.`,
        );
        continue;
      }
      const iv = inflect.guessCaseValue(fnc.name);
      const className = facetClassName(iv);
      const tsGenCode = `
      import { medigyGovnQE } from "${depsTs}";
      import lhcFormJsonModule from "./${
        tdg.forceExtension(".lhc-form.auto.ts", fnc.name)
      }";
      
      // deno-lint-ignore no-empty-interface
      export interface ${className}ConstructionContext extends medigyGovnQE.EvalFacetConstructionContext {}

      export class ${className} extends medigyGovnQE.EvaluationFacet {
        constructor(ctx?: ${className}ConstructionContext) {
          super({ ...ctx, nihlhcForm: lhcFormJsonModule });
        }
      }
      
      export default ${className};
      `;
      if (verbose) console.log(tsGenFileName);
      Deno.writeTextFileSync(tsGenFileName, tsGenCode);
    }
    return true;
  }
}

export async function lhcFormJsonToTypedDataTs(
  options: docopt.DocOptions,
): Promise<true | void> {
  const {
    "json-to-typed-data": jsonToTypedData,
    "<lhc-json-src>": lhcFormJsonSrcSpec,
  } = options;
  if (jsonToTypedData && lhcFormJsonSrcSpec) {
    const verbose = cli.isVerbose(options);
    const sourceSpec = lhcFormJsonSrcSpec.toString();
    const [depsTs, depsTestTs] = deps(options);
    for (const we of fs.expandGlobSync(sourceSpec)) {
      const fnc = cli.fileNameComponents(we.name);
      const jsonValue = JSON.parse(Deno.readTextFileSync(we.path));
      const jsonModuleFileName = cli.forceExtension(
        ".lhc-form.auto.ts",
        we,
        fnc,
      );
      let tsModuleCode = `
      // Generated from ${we.name}. DO NOT EDIT.

      import { nihLhcForms as lforms, typedDataGen } from "${depsTs}";

      export const form: lforms.NihLhcForm = ${
        sjs.stringify(jsonValue, tdg.cleanJS, 2)
      };
      
      export default form;
      
      if (import.meta.main) {
        new typedDataGen.CliArgsEmitter(import.meta.url).emitJSON(form);
      }`;
      if (verbose) console.log(path.relative(Deno.cwd(), jsonModuleFileName));
      Deno.writeTextFileSync(jsonModuleFileName, tsModuleCode);
    }
    return true;
  }
}

if (import.meta.main) {
  await cli.CLI(docoptSpec, [
    lhcFormsToCampaigns,
    lhcFormJsonToQualEvalFacet,
    lhcFormJsonToTypedDataTs,
  ]);
}
