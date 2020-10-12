import * as inspLF from "../inspect-lhc-form.ts";
import * as inspText from "../inspect-text.ts";
import type * as insp from "../inspect.ts";
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
  readonly editable?: 1;
}

export interface RequiredMultipleAnswers {
  readonly answerCardinality: { min: 1; max: "*" };
}

export type RequiredUniqueTextItem = lf.UniqueTextItem & RequiredSingleAnswer;

export interface RespondentCompanyName extends RequiredUniqueTextItem {
  readonly questionCode: "company-name";
  readonly localQuestionCode: "company-name";
  readonly question: "Name of the company providing this offering*";
  readonly noEmptyValue: true;
  readonly linkId: "/Q002/company-name";
  readonly codingInstructions: "Full name of the company including Inc, LLC";
  readonly codeList: [
    RespondantCompanyNameCodeList,
  ];
  readonly value: string;
}

export interface RespondantCompanyNameCodeList extends lf.FormItem {
  readonly code: "company-name";
  readonly display: "Name of the company providing this offering*";
  readonly system: "http://loinc.org";
}

export interface RespondentEmailAddress extends lf.UniqueEmailAddressItem {
  readonly questionCode: "Q002-05";
  readonly localQuestionCode: "Q002-05";
  readonly question: "Email address of the company*";
  readonly noEmptyValue: true;
  readonly linkId: "/Q002/Q002-05";
  readonly codingInstructions:
    "Valid email id. Verify using https://email-checker.net/";
  readonly codeList: [
    RespondantEmailAddresscCodeList,
  ];
}

export interface RespondantEmailAddresscCodeList extends lf.FormItem {
  readonly code: "Q002-05";
  readonly display: "Email address of the company*";
  readonly system: "http://loinc.org";
}

export interface RespondentContactPhoneNumber extends lf.UniquePhoneItem {
  readonly questionCode: "Q002-06";
  readonly localQuestionCode: "Q002-06";
  readonly question: "Contact number of the company*";
  readonly noEmptyValue: true;
  readonly linkId: "/Q002/Q002-06";
  readonly codingInstructions: "Valid phone number with country code";
  readonly codeList: [
    RespondantContactPhoneNumberCodeList,
  ];
}

export interface RespondantContactPhoneNumberCodeList extends lf.FormItem {
  readonly code: "Q002-06";
  readonly display: "Contact number of the company*";
  readonly system: "http://loinc.org";
}

export interface RespondentVendorName extends RequiredUniqueTextItem {
  readonly questionCode: "Q002-07";
  readonly localQuestionCode: "Q002-07";
  readonly question: "Vendor Name*";
  readonly noEmptyValue: true;
  readonly linkId: "/Q002/07";
  readonly codingInstructions:
    "The owner's name of the company. If vendor name is available, use it; otherwise, fill it with Offering company name";
  readonly codeList: [
    RespondentVendorNameCodeList,
  ];
}

export interface RespondentVendorNameCodeList extends lf.FormItem {
  readonly code: "Q002-07";
  readonly display: "Vendor Name*";
  readonly system: "http://loinc.org";
}

export interface RespondentVendorEmailAddress
  extends lf.UniqueEmailAddressItem {
  readonly questionCode: "Q002-08";
  readonly localQuestionCode: "Q002-08";
  readonly question: "Vendor Email Address";
  readonly noEmptyValue: true;
  readonly linkId: "/Q002/Q002-08";
  readonly codingInstructions:
    "It should be a valid email from the company personnel. If data is not available, fill it with Company email id, if possible. Verify using https://email-checker.net/";
  readonly codeList: [
    RespondentVendorEmailAddressCodeList,
  ];
}

export interface RespondentVendorEmailAddressCodeList extends lf.FormItem {
  readonly code: "Q002-08";
  readonly display: "Vendor Email Address";
  readonly system: "http://loinc.org";
}

export interface RespondentVendorPhoneNumber extends lf.UniquePhoneItem {
  readonly questionCode: "Q002-09";
  readonly localQuestionCode: "Q002-09";
  readonly question: "Vendor Phone";
  readonly noEmptyValue: true;
  readonly linkId: "/Q002/Q002-09";
  readonly codingInstructions:
    "Valid Phone number of company personnel. If the vendor phone is available, use it; otherwise, fill it with company phone if available";
  readonly codeList: [
    RespondentVendorPhoneNumberCodeList,
  ];
}

export interface RespondentVendorPhoneNumberCodeList extends lf.FormItem {
  readonly code: "Q002-09";
  readonly display: "Vendor Phone";
  readonly system: "http://loinc.org";
}

export interface RespondentSource extends lf.ConstrainedListItem {
  readonly questionCode: "Q002-10";
  readonly localQuestionCode: "Q002-10";
  readonly question: "Source of Invitation";
  readonly linkId: "/Q002/Q002-10";
  readonly codingInstructions:
    "Use 'www.medigy.com' if there is no value in this field";
  readonly codeList: [
    RespondentSourceCodeList,
  ];
}

export interface RespondentSourceCodeList extends lf.FormItem {
  readonly code: "Q002-10";
  readonly display: "Source of Invitation";
  readonly system: "http://loinc.org";
}

export interface RespondentContactInformation extends lf.FormItem {
  readonly header: true;
  readonly question: "Respondent Contact Information";
  readonly hideUnits: true;
  readonly questionCode: "Q002";
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
  readonly questionCode: "Q005";
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
  readonly linkId: "/Q005/Q005-14";
  readonly codingInstructions: "Offering type as Product/ Solution/ Service";
  readonly codeList: [
    OfferingTypeCodeList,
  ];
}

export interface OfferingTypeCodeList extends lf.FormItem {
  readonly code: "Q005-14";
  readonly display: "Type of offering*";
  readonly system: "http://loinc.org";
}

export interface OfferingOwnerCheck extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-18";
  readonly localQuestionCode: "Q005-18";
  readonly question: "Are you the owner*";
  readonly linkId: "/Q005/Q005-18";
  readonly codeList: [
    OfferingOwnerCheckCodeList,
  ];
}

export interface OfferingOwnerCheckCodeList extends lf.FormItem {
  readonly code: "Q005-18";
  readonly display: "Are you the owner*";
  readonly system: "http://loinc.org";
}

export interface OfferingTopics extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-01";
  readonly localQuestionCode: "Q005-01";
  readonly question: "Select the categories that best describe the offering*";
  readonly linkId: "/Q005/Q005-01";
  readonly codingInstructions:
    "Select at least one category best suits to this offering";
  readonly codeList: [
    OfferingTopicsCodeList,
  ];
}

export interface OfferingTopicsCodeList extends lf.FormItem {
  readonly code: "Q005-01";
  readonly display: "Select the categories that best describe the offering*";
  readonly system: "http://loinc.org";
}

export interface OfferingName extends RequiredUniqueTextItem {
  readonly questionCode: "Q005-02";
  readonly localQuestionCode: "Q005-02";
  readonly question: "Offering name*";
  readonly linkId: "/Q005/Q005-02";
  readonly codingInstructions:
    "Name of the offering, with Trade mark TM, Registration mark R, etc - in correct letter case";
  readonly codeList: [
    OfferingNameCodeList,
  ];
}

export interface OfferingNameCodeList extends lf.FormItem {
  readonly code: "Q005-02";
  readonly display: "Offering name*";
  readonly system: "http://loinc.org";
}
export interface OfferingOneLinerDescription extends UniqueMultiLineTextItem {
  readonly questionCode: "Q005-11";
  readonly localQuestionCode: "Q005-11";
  readonly question: "A one liner describing the offering";
  readonly linkId: "/Q005/Q005-11";
  readonly codingInstructions:
    "Short description of the offering. Use 10 to 15 words without any spelling/grammar errors. Pass the text through Grammarly";
  readonly codeList: [
    OfferingOneLinerDescriptionCodeList,
  ];
}

export interface OfferingOneLinerDescriptionCodeList extends lf.FormItem {
  readonly code: "Q005-11";
  readonly display: "A one liner describing the offering";
  readonly system: "http://loinc.org";
}

export interface OfferingFeaturedProductCheck extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-12";
  readonly localQuestionCode: "Q005-12";
  readonly question: "Feature Product";
  readonly linkId: "/Q005/Q005-12";
  readonly codingInstructions:
    "Select 'Yes' only if you feel this offering is to be featured in Medigy; otherwise, choose 'No' while approving.";
  readonly codeList: [
    OfferingFeaturedProductCheckCodeList,
  ];
}

export interface OfferingFeaturedProductCheckCodeList extends lf.FormItem {
  readonly code: "Q005-12";
  readonly display: "Feature Product";
  readonly system: "http://loinc.org";
}

export interface OfferingCreatedDate extends UniqueDateItem {
  readonly questionCode: "Q005-13";
  readonly localQuestionCode: "Q005-13";
  readonly question: "Created On*";
  readonly linkId: "/Q005/Q005-13";
  readonly codingInstructions: "Offering posted date in mm/dd/yyyy format";
  readonly codeList: [
    OfferingCreatedDateCodeList,
  ];
}

export interface OfferingCreatedDateCodeList extends lf.FormItem {
  readonly code: "Q005-13";
  readonly display: "Created On*";
  readonly system: "http://loinc.org";
}

export interface OfferingWebsite extends lf.UniqueTextItem {
  readonly questionCode: "Q005-03";
  readonly localQuestionCode: "Q005-02";
  readonly question: "Website of the offering";
  readonly linkId: "/Q005/Q005-03";
  readonly codingInstructions:
    "URL of the offering, where information related to this offering is mentioned";
  readonly codeList: [
    OfferingWebsiteCodeList,
  ];
}

export interface OfferingWebsiteCodeList extends lf.FormItem {
  readonly code: "Q005-03";
  readonly display: "Website of the offering";
  readonly system: "http://loinc.org";
}

export interface OfferingLicense extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-22";
  readonly localQuestionCode: "Q005-22";
  readonly question: "License Of The Offering";
  readonly linkId: "/Q005/Q005-22";
  readonly codingInstructions:
    "Opensource type, Commercial, None of the above - Choose from the list";
  readonly codeList: [
    OfferingLicenseCodeList,
  ];
}

export interface OfferingLicenseCodeList extends lf.FormItem {
  readonly code: "Q005-22";
  readonly display: "License Of The Offering";
  readonly system: "http://loinc.org";
}

export interface OfferingGitRepository extends lf.UniqueTextItem {
  readonly questionCode: "Q005-06";
  readonly localQuestionCode: "Q005-06";
  readonly question: "GIT repository link of the offering";
  readonly linkId: "/Q005/Q005-06";
  readonly codingInstructions:
    "GIT URL of the offering, to be checked in GIThub";
  readonly codeList: [
    OfferingGitRepositoryCodeList,
  ];
}

export interface OfferingGitRepositoryCodeList extends lf.FormItem {
  readonly code: "Q005-06";
  readonly display: "GIT repository link of the offering";
  readonly system: "http://loinc.org";
}

export interface OfferingDescription extends UniqueMultiLineTextItem {
  readonly questionCode: "Q005-07";
  readonly localQuestionCode: "Q005-07";
  readonly question:
    "Describe the key benefits and unique value proposition of the offering";
  readonly linkId: "/Q005/Q005-07";
  readonly codingInstructions:
    "The offering description, TM, R to be checked - Maximum 45 to 50 words without any spelling/grammar error. Run the text through Grammarly";
  readonly codeList: [
    OfferingDescriptionCodeList,
  ];
}

export interface OfferingDescriptionCodeList extends lf.FormItem {
  readonly code: "Q005-07";
  readonly display:
    "Describe the key benefits and unique value proposition of the offering";
  readonly system: "http://loinc.org";
}

export interface OfferingPermaLink extends lf.UniqueTextItem {
  readonly questionCode: "Q005-10";
  readonly localQuestionCode: "Q005-10";
  readonly question: "Permalink";
  readonly linkId: "/Q005/Q005-10";
  readonly codingInstructions:
    "Related to Offering name. If the data is blank, create permalink by replacing spaces with a hyphen and use only small letters (E.g., citus-health)";
  readonly codeList: [
    OfferingPermaLinkCodeList,
  ];
}

export interface OfferingPermaLinkCodeList extends lf.FormItem {
  readonly code: "Q005-10";
  readonly display: "Permalink";
  readonly system: "http://loinc.org";
}

export interface SocialPresence extends lf.FormItem {
  readonly header: true;
  readonly questionCode: "Q006";
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
  readonly linkId: "/Q006/Q006-01";
  readonly codingInstructions: "Facebook URL, to be verified in Facebook";
  readonly codeList: [
    SocialPresenceFacebookLinkCodeList,
  ];
}

export interface SocialPresenceFacebookLinkCodeList extends lf.FormItem {
  readonly code: "Q006-01";
  readonly display: "Facebook page of the offering";
  readonly system: "http://loinc.org";
}

export interface SocialPresenceTwitterLink extends lf.UniqueTextItem {
  readonly questionCode: "Q006-02";
  readonly localQuestionCode: "Q006-02";
  readonly question: "Twitter page of the offering";
  readonly linkId: "/Q006/Q006-02";
  readonly codingInstructions: "Twitter URL to be verified in Twitter";
  readonly codeList: [
    SocialPresenceTwitterLinkCodeList,
  ];
}

export interface SocialPresenceTwitterLinkCodeList extends lf.FormItem {
  readonly code: "Q006-02";
  readonly display: "Twitter page of the offering";
  readonly system: "http://loinc.org";
}

export interface SocialPresenceLinkedInLink extends lf.UniqueTextItem {
  readonly questionCode: "Q006-03";
  readonly localQuestionCode: "Q006-03";
  readonly question: "LinkedIn page of the offering";
  readonly linkId: "/Q006/Q006-03";
  readonly codingInstructions: "LinkedIn URL to be verified in LinkedIn";
  readonly codeList: [
    SocialPresenceLinkedInLinkCodeList,
  ];
}

export interface SocialPresenceLinkedInLinkCodeList extends lf.FormItem {
  readonly code: "Q006-03";
  readonly display: "LinkedIn page of the offering";
  readonly system: "http://loinc.org";
}

export interface SocialPresenceInstagramLink extends lf.UniqueTextItem {
  readonly questionCode: "Q006-04";
  readonly localQuestionCode: "Q006-04";
  readonly question: "Instagram page of the offering";
  readonly linkId: "/Q006/Q006-04";
  readonly codingInstructions: "Instagram URL to be verified in Instagram";
  readonly codeList: [
    SocialPresenceInstagramLinkCodeList,
  ];
}

export interface SocialPresenceInstagramLinkCodeList extends lf.FormItem {
  readonly code: "Q006-04";
  readonly display: "Instagram page of the offering";
  readonly system: "http://loinc.org";
}

export interface OfferingProfileLhcForm extends lf.NihLhcForm {
  readonly name: "Product Profile";
  readonly items: [
    RespondentContactInformation,
    ProductDetails,
    SocialPresence,
  ];
}

/**
 * OfferingProfileValidator is focused on testing values of fields. The 
 * OfferingProfileLhcForm can do all the structural validation but because
 * it is tightly tied to LCH Form JSON schema, we have to do values 
 * validation in this class instead of OfferingProfileLhcForm.
 */
export class OfferingProfileValidator
  extends inspLF.LhcFormInspectionSupplier<OfferingProfileLhcForm> {
  static readonly singleton = new OfferingProfileValidator();

  async inspect(
    ctx: inspLF.LhcFormInspectionContext<OfferingProfileLhcForm>,
    diags: inspLF.LhcFormInspectionDiagnostics<OfferingProfileLhcForm>,
  ): Promise<insp.InspectionResult> {
    const op = ctx.form;
    await this.inspectProductDetails(ctx, diags, op.items[1]);
    return inspLF.lformInspectionSuccess<OfferingProfileLhcForm>(op);
  }

  protected async inspectProductDetails(
    ctx: inspLF.LhcFormInspectionContext<OfferingProfileLhcForm>,
    diags: inspLF.LhcFormInspectionDiagnostics<OfferingProfileLhcForm>,
    pd: ProductDetails,
  ) {
    const oneLiner: OfferingOneLinerDescription = pd.items[4];
    await this.inspectText(
      ctx,
      diags,
      oneLiner,
      inspText.inspectWordCountRange,
    );

    const websiteURL: OfferingWebsite = pd.items[7];
    await this.inspectText(
      ctx,
      diags,
      websiteURL,
      inspText.inspectWebsiteURL,
    );
  }

  protected async inspectText(
    ctx: inspLF.LhcFormInspectionContext<OfferingProfileLhcForm>,
    diags: inspLF.LhcFormInspectionDiagnostics<OfferingProfileLhcForm>,
    item: lf.FormItem,
    ...inspectors: inspText.TextInspector[]
  ) {
    const tidr = new inspText.TextInspectionDiagnosticsRecorder();
    await inspText.TextInspectionSupplier.typical.inspect(
      // TODO: need to figure out how to get proper value for each item
      new inspText.TextInspectionContext(item.value?.toString() || ""),
      tidr,
      ...inspectors,
    );
    tidr.issues.forEach((issue) => diags.onIssue(issue, ctx));
    tidr.exceptions.forEach((excp) =>
      diags.onException(excp.exception, excp, ctx)
    );
  }
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
