import { govnData as gd, nihLhcForms as lf } from "./deps.ts";

export interface MultiLineTextItem extends lf.FormItem {
  readonly dataType: "TX";
}

export function isMultiLineTextItem(i: lf.FormItem): i is MultiLineTextItem {
  return i.dataType == "TX";
}

export type UniqueMultiLineTextItem = MultiLineTextItem & lf.UniqueItem;

export interface DateItem extends lf.FormItem {
  readonly dataType: "DT";
}

export function isDateItem(i: lf.FormItem): i is DateItem {
  return i.dataType == "DT";
}

export type UniqueDateItem = DateItem & lf.UniqueItem;

export interface RequiredSingleAnswer {
  readonly answerCardinality: { min: 0 | 1; max: 1 };
}

export interface RequiredMultipleAnswers {
  readonly answerCardinality: { min: 1; max: "*" };
}

export type RequiredUniqueTextItem = lf.UniqueTextItem & RequiredSingleAnswer;

export interface RespondentCompanyName extends RequiredUniqueTextItem {
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

export interface RespondentVendorName extends RequiredUniqueTextItem {
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
  readonly items: [
    OfferingType,
    OfferingOwnerCheck,
    OfferingTopics,
    OfferingName,
    OfferingOneLinerDescription,
    OfferingFeaturedProductCheck,
    OfferingCreatedDate,
    OfferingWebsite,
    OfferingLicense,
    OfferingGitRepository,
    OfferingDescription,
    OfferingPermaLink,
  ];
}

export interface OfferingType extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-14";
  readonly localQuestionCode: "Q005-14";
  readonly question: "Type of offering*";
}

export interface OfferingOwnerCheck extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-18";
  readonly localQuestionCode: "Q005-18";
  readonly question: "Are you the owner*";
}

export interface OfferingTopics extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-01";
  readonly localQuestionCode: "Q005-01";
  readonly question: "Select the categories that best describe the offering*";
}

export interface OfferingName extends RequiredUniqueTextItem {
  readonly questionCode: "Q005-02";
  readonly localQuestionCode: "Q005-02";
  readonly question: "Offering name*";
}

export interface OfferingOneLinerDescription extends UniqueMultiLineTextItem {
  readonly questionCode: "Q005-11";
  readonly localQuestionCode: "Q005-11";
  readonly question: "A one liner describing the offering";
}

export interface OfferingFeaturedProductCheck extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-12";
  readonly localQuestionCode: "Q005-12";
  readonly question: "Feature Product";
}

export interface OfferingCreatedDate extends UniqueDateItem {
  readonly questionCode: "Q005-13";
  readonly localQuestionCode: "Q005-13";
  readonly question: "Created On*";
}

export interface OfferingWebsite extends lf.UniqueTextItem {
  readonly questionCode: "Q005-03";
  readonly localQuestionCode: "Q005-02";
  readonly question: "Website of the offering";
}

export interface OfferingLicense extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-22";
  readonly localQuestionCode: "Q005-22";
  readonly question: "License Of The Offering";
}

export interface OfferingGitRepository extends lf.UniqueTextItem {
  readonly questionCode: "Q005-06";
  readonly localQuestionCode: "Q005-06";
  readonly question: "GIT repository link of the offering";
}

export interface OfferingDescription extends UniqueMultiLineTextItem {
  readonly questionCode: "Q005-07";
  readonly localQuestionCode: "Q005-07";
  readonly question:
    "Describe the key benefits and unique value proposition of the offering";
}

export interface OfferingPermaLink extends lf.UniqueTextItem {
  readonly questionCode: "Q005-10";
  readonly localQuestionCode: "Q005-10";
  readonly question: "Permalink";
}

export interface SocialPresence extends lf.FormItem {
  readonly header: true;
  readonly question: "Social Presence";
  readonly items: [
    SocialPresenceFacebookLink,
    SocialPresenceTwitterLink,
    SocialPresenceLinkedInLink,
    SocialPresenceInstagramLink,
  ];
}

export interface SocialPresenceFacebookLink extends lf.UniqueTextItem {
  readonly questionCode: "Q006-01";
  readonly localQuestionCode: "Q006-01";
  readonly question: "Facebook page of the offering";
}

export interface SocialPresenceTwitterLink extends lf.UniqueTextItem {
  readonly questionCode: "Q006-02";
  readonly localQuestionCode: "Q006-02";
  readonly question: "Twitter page of the offering";
}

export interface SocialPresenceLinkedInLink extends lf.UniqueTextItem {
  readonly questionCode: "Q006-03";
  readonly localQuestionCode: "Q006-03";
  readonly question: "LinkedIn page of the offering";
}

export interface SocialPresenceInstagramLink extends lf.UniqueTextItem {
  readonly questionCode: "Q006-04";
  readonly localQuestionCode: "Q006-04";
  readonly question: "Instagram page of the offering";
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
      "medigyGovn.offerProfile.lf.OfferingProfileLhcForm",
      {
        instanceName: "profile",
        emittedFileExtn: ".lhc-form.auto.ts",
        govnDataImportURL: options.govnDataModuleRef,
      },
    ));
  }
}
