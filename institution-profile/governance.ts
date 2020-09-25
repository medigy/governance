import { governedInstr } from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface InstitutionProfileConstructionContext
  extends governedInstr.TypicalInstrumentOptions {
}

export interface InstitutionProfileConstructor {
  new (ctx: InstitutionProfileConstructionContext): InstitutionProfile;
}

export class InstitutionProfile extends governedInstr.TypicalInstrument {
}
