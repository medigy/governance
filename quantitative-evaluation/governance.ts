import { governedInstr } from "./deps.ts";

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
