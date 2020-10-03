import { govnData as gd, nihLhcForms as lf } from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface QuantEvalFacetLhcForm extends lf.NihLhcForm {
}

/**
 * QuantEvalLhcFormJsonTyper takes an LHC Form JSON file and "types" it as 
 * a Medigy Quantitative Evaluation Facet. Once "typed" an LHC Form may be 
 * validated by the TypeScript compiler.
 */
export class QuantEvalFacetLhcFormJsonTyper extends gd.TypicalJsonTyper {
  constructor(
    options: {
      govnDataModuleRef: string;
      govnDataModuleImportDirective: string;
      medigyGovnModuleTypeImportDirective: string;
    },
  ) {
    super(gd.defaultTypicalJsonTyperOptions(
      [
        options.govnDataModuleImportDirective,
        options.medigyGovnModuleTypeImportDirective,
      ],
      "medigyGovn.quantEval.lf.QuantEvalFacetLhcForm",
      {
        instanceName: "facet",
        emittedFileExtn: ".lhc-form.auto.ts",
        govnDataImportURL: options.govnDataModuleRef,
      },
    ));
  }
}
