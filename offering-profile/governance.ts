import { governedInstr } from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface IndividualProfileConstructionContext
  extends governedInstr.TypicalInstrumentOptions {
}

export interface IndividualProfileConstructor {
  new (ctx: IndividualProfileConstructionContext): IndividualProfile;
}

export class IndividualProfile extends governedInstr.TypicalInstrument {
}
