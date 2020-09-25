import { governedInstr } from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface QualitativeExperienceConstructionContext
  extends governedInstr.TypicalInstrumentOptions {
}

export interface QualitativeExperienceConstructor {
  new (ctx: QualitativeExperienceConstructionContext): QualitativeExperience;
}

export class QualitativeExperience extends governedInstr.TypicalInstrument {
}
