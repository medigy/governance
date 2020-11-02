import type { IndividualProfile } from "../individual-profile/governance.ts";
import type { InstitutionProfile } from "../institution-profile/governance.ts";
import { governedInstr } from "./deps.ts";

export interface OfferingProfileConstructionContext
  extends governedInstr.TypicalInstrumentOptions {
  readonly nature: OfferingNature;
}

export interface OfferingProfileConstructor {
  new (ctx: OfferingProfileConstructionContext): OfferingProfile;
}

export enum OfferingStatus {
  APPROVED = "Approved",
  PENDING = "Pending",
  ARCHIVED = "Archived",
}

export enum OfferingType {
  PRODUCT = "Product",
  SOLUTION = "Solution",
  SERVICE = "Service",
}

export enum OfferingState {
  CLOSED = "closed",
  OPENED = "opened",
  REOPENED = "reopened",
}

export type OfferingOwner = "Yes" | "No";
export type OpensourceProduct = "Yes" | "No";
export interface Categories {
  [index: number]: string;
}

export interface OfferingImage {
  readonly image: string;
  readonly logo: string;
}

export interface ProductProfile extends OfferingImage {
  readonly offeringType: OfferingType;
  readonly categories: Categories;
  readonly offeringOwner: OfferingOwner;
  readonly offeringName: string;
  readonly shortDescription: string;
  readonly openSourceProduct: OpensourceProduct;
  readonly offeringCreatedAt: string;
  readonly offeringWebsite: string;
  readonly openSourceLicense: string;
  readonly gitRepoLink: string;
}
export interface RespondantInformation {
  readonly vendorCompanyName: string;
  readonly vendorCompanyEmail: string;
  readonly vendorCompanyContact: string;
  readonly vendorName: string;
  readonly vendorEmail: string;
  readonly vendorContact: string;
  readonly vendorInvitationSource: string;
}
export interface SocialPresence {
  readonly facebookUrl: string;
  readonly twitterUrl: string;
  readonly linkedInUrl: string;
  readonly instagramUrl: string;
}
export interface ActivityData {
  readonly forks: number;
  readonly openIssues: number;
  readonly stars: number;
  readonly watchers: number;
  readonly weight: number;
  readonly facebookShare: number;
  readonly twitterShare: number;
  readonly emailShare: number;
}
export interface OfferingNature {
  readonly isOffering: true;
  readonly proudctProfile: ProductProfile;
  readonly respondantInformation: RespondantInformation;
  readonly socialPresence: SocialPresence;
  readonly author: IndividualProfile;
  readonly status: OfferingStatus;
  readonly uuid: string;
  readonly institution: InstitutionProfile;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly assignee: IndividualProfile;
  readonly state: OfferingState;
  readonly closedAt: string;
  readonly closedBy: IndividualProfile;
  readonly prometheusActivity: ActivityData;
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
