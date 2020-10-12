import {
  fs,
  governedInstr,
  govnData as gd,
  inflect,
  nihLhcForms as lform,
  path,
} from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface EvalFacetConstructionContext
  extends governedInstr.TypicalInstrumentOptions {
}

export interface EvalFacetConstructor {
  new (ctx: EvalFacetConstructionContext): EvaluationFacet;
}

export interface EvalFacetsConstructionContext
  extends Partial<governedInstr.Identifiable> {
  readonly path: governedInstr.Path;
}

export interface EvalFacetsConstructor {
  new (ctx: EvalFacetsConstructionContext): EvaluationFacets;
}

export class EvaluationFacet extends governedInstr.TypicalInstrument {
}

export class EvaluationFacets extends governedInstr.TypicalCampaign {
  constructor(
    { identity }: governedInstr.Identifiable & EvalFacetsConstructionContext,
  ) {
    super(identity);
  }
}

export class EvaluationFacetTyper extends lform.LhcFormContainer {
  static facetClassName(fileNameIV: inflect.InflectableValue): string {
    return gd.typeScriptClassName(
      fileNameIV,
      { forceSuffix: "Facet", removeSuffixes: ["EvaluationFacet"] },
    );
  }

  constructor(readonly options: { medigyGovnModuleImportDirective: string }) {
    super();
  }

  className(fileNameIV: inflect.InflectableValue, fc: gd.FileContext): string {
    return EvaluationFacetTyper.facetClassName(fileNameIV);
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
    ${this.options.medigyGovnModuleImportDirective};
    import lhcFormJsonModule from "./${lhcFormModuleRel}";

    // deno-lint-ignore no-empty-interface
    export interface ${className}ConstructionContext extends medigyGovn.quantEval.EvalFacetConstructionContext {}

    export class ${className} extends medigyGovn.quantEval.EvaluationFacet {
      constructor(ctx?: ${className}ConstructionContext) {
        super({ ...ctx, nihlhcForm: lhcFormJsonModule });
      }
    }

    export default ${className};
    `.replaceAll(/^ {8}/gm, ""); // remove indendation
  }
}

export async function EvaluationFacetCampaignsTyper(
  {
    startPath,
    lhcFormJsonSrcSpec,
    verbose,
    overwrite,
    medigyGovnModuleImportDirective,
  }: {
    startPath: string;
    lhcFormJsonSrcSpec: string;
    medigyGovnModuleImportDirective: string;
    verbose?: boolean;
    overwrite?: boolean;
  },
): Promise<void> {
  if (!fs.existsSync(startPath)) {
    console.error(`${startPath} does not exist.`);
    return;
  }
  const stat = Deno.statSync(startPath);
  if (!stat.isDirectory) {
    console.error(`${startPath} is not a directory.`);
    return;
  }

  for (const dirWE of fs.walkSync(startPath)) {
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
        lhcFormJsonSrcSpec ? lhcFormJsonSrcSpec.toString() : "*.lhc-form.json",
      );
      for (const we of fs.expandGlobSync(jsonSpec)) {
        if (
          dirWE.path != path.dirname(path.relative(startPath, we.path))
        ) {
          continue;
        }
        const gweCtx = gd.FileSystemGlobSupplier.globWalkEntryContext(we);
        const formIV = inflect.guessCaseValue(gweCtx.fileNameWithoutExtn);
        const className = EvaluationFacetTyper.facetClassName(
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
          ${medigyGovnModuleImportDirective};

          ${imports.join("\n")}

          // deno-lint-ignore no-empty-interface
          export interface ${facetsMgrClassName}ConstructionContext extends medigyGovn.quantEval.EvalFacetsConstructionContext {}

          export class ${facetsMgrClassName} extends medigyGovn.quantEval.EvaluationFacets {
            static readonly facets: readonly medigyGovn.quantEval.EvalFacetConstructor[] = [
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
}
