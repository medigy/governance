import { govnData as gd, nihLhcForms as lf } from "./deps.ts";

export interface RespondentCompanyName extends lf.UniqueTextItem {
  readonly questionCode: "company-name";
  readonly localQuestionCode: "company-name";
  readonly question: "Name of the company providing this offering*";
}

export interface RespondentEmailAddress extends lf.UniqueEmailAddressItem {
  readonly questionCode: "Q002-05";
  readonly localQuestionCode: "Q002-05";
  readonly question: "Email address of the company*";
}

export interface RespondentContactPhoneNumber extends lf.UniquePhoneItem {
  readonly questionCode: "Q002-06";
  readonly localQuestionCode: "Q002-06";
  readonly question: "Contact number of the company*";
}

export interface RespondentVendorName extends lf.UniqueTextItem {
  readonly questionCode: "Q002-07";
  readonly localQuestionCode: "Q002-07";
  readonly question: "Vendor Name*";
}

export interface RespondentVendorEmailAddress
  extends lf.UniqueEmailAddressItem {
  readonly questionCode: "Q002-08";
  readonly localQuestionCode: "Q002-08";
  readonly question: "Vendor Email Address";
}

export interface RespondentVendorPhoneNumber extends lf.UniquePhoneItem {
  readonly questionCode: "Q002-09";
  readonly localQuestionCode: "Q002-09";
  readonly question: "Vendor Phone";
}

export interface RespondentSource extends lf.ConstrainedListItem {
  readonly questionCode: "Q002-10";
  readonly localQuestionCode: "Q002-10";
  readonly question: "Source of Invitation";
}

export interface RespondentContactInformation extends lf.FormItem {
  readonly header: true;
  readonly question: "Respondent Contact Information";
  readonly items: [
    RespondentCompanyName,
    RespondentEmailAddress,
    RespondentContactPhoneNumber,
    RespondentVendorName,
    RespondentVendorEmailAddress,
    RespondentVendorPhoneNumber,
    RespondentSource,
  ];
}

export interface ProductDetails extends lf.FormItem {
  readonly header: true;
  readonly question: "Product Details";
}

export interface SocialPresence extends lf.FormItem {
  readonly header: true;
  readonly question: "Social Presence";
}

export interface OfferingProfileLhcForm extends lf.NihLhcForm {
  readonly items: [
    RespondentContactInformation,
    ProductDetails,
    SocialPresence,
  ];
}

/**
 * OfferingProfileLhcFormJsonTyper takes an LHC Form JSON file and "types"
 * it as a Medigy Offering Profile. Once "typed" an LHC Form may be validated
 * by the TypeScript compiler.
 */
export class OfferingProfileLhcFormJsonTyper extends gd.TypicalJsonTyper {
  constructor(
    options: {
      govnDataModuleImportDirective: string;
      medigyGovnModuleRef: string;
    },
  ) {
    super(gd.defaultTypicalJsonTyperOptions(
      [
        options.govnDataModuleImportDirective,
        `import type * as op from "${options.medigyGovnModuleRef}/offering-profile/lform.ts";`,
      ],
      "op.OfferingProfileLhcForm",
      { instanceName: "profile", emittedFileExtn: ".lhc-form.auto.ts" },
    ));
  }
}
