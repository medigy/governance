import {
  govnData as gd,
  inflect,
  nihLhcForms as lform,
  path,
  governedInstr,
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
