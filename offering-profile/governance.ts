import { governedInstr } from "./deps.ts";

export interface OfferingProfileConstructionContext
  extends governedInstr.TypicalInstrumentOptions {
  readonly nature: OfferingNature;
}

export interface OfferingProfileConstructor {
  new (ctx: OfferingProfileConstructionContext): OfferingProfile;
}

export interface OfferingNature {
  readonly isOffering: true;
}

export interface ProductOffering extends OfferingNature {
  readonly isProductOffering: true;
}

export interface ServiceOffering extends OfferingNature {
  readonly isServiceOffering: true;
}

export interface SolutionOffering extends ProductOffering, ServiceOffering {
  readonly isSolutionOffering: true;
}

export interface InfrastructureOffering extends ProductOffering {
  readonly isInfrastructureOffering: true;
}

export interface ApiOffering extends ProductOffering {
  readonly isApiOffering: true;
}

export class OfferingProfile extends governedInstr.TypicalInstrument {
  constructor(opcc: OfferingProfileConstructionContext) {
    super(opcc);
  }
}
