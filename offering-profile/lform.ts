import {
  govnData as gd,
  inspect as insp,
  inspText,
  nihLhcForms as lf,
} from "./deps.ts";

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

export interface ConstrainedListItemValue extends lf.FormItem {
  readonly text: string;
  readonly code?: string | number;
}

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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: ConstrainedListItemValue;
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
  readonly value: ConstrainedListItemValue;
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
  readonly value: ConstrainedListItemValue;
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
  readonly value: ConstrainedListItemValue[];
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: ConstrainedListItemValue;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: ConstrainedListItemValue;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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
  readonly value: string;
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

async function inspectText(
  lformCtx: lf.LhcFormInspectionContext<OfferingProfileLhcForm>,
  form: OfferingProfileLhcForm,
  item: lf.FormItem,
  ...inspectors: inspText.TextInspector[]
): Promise<void> {
  if (!item.value) {
    // TODO: if this is required, need to add error
    return;
  }
  const itCtx = new inspText.TypicalTextInspectionContext(
    item.value.toString(),
  );
  const ip = insp.inspectionPipe(itCtx, ...inspectors);
  const result = await ip(itCtx);
  lformCtx.diags.append(form, itCtx.diags, lformCtx);
}

async function inspectProductDetails(
  ctx: lf.LhcFormInspectionContext<OfferingProfileLhcForm>,
  active: lf.LhcFormInspectionResult<OfferingProfileLhcForm>,
): Promise<lf.LhcFormInspectionResult<OfferingProfileLhcForm>> {
  const op = active.inspectionTarget;
  const pd: ProductDetails = op.items[1];
  const oneLiner: OfferingOneLinerDescription = pd.items[4];
  await inspectText(
    ctx,
    op,
    oneLiner,
    inspText.inspectWordCountRange,
  );
  const websiteURL: OfferingWebsite = pd.items[7];
  await inspectText(
    ctx,
    op,
    websiteURL,
    inspText.inspectWebsiteURL,
  );
  /* Validate with reference source site */
  const license: OfferingLicense = pd.items[8];
  await inspectText(
    ctx,
    op,
    license,
    // inspText.inspectLicense,
  );
  /* Mandatory if "License Of The Offering" is Open Source
   * GIT URL of the offering repository
   * Validate with reference source site
   */
  const gitRepository: OfferingGitRepository = pd.items[9];
  await inspectText(
    ctx,
    op,
    gitRepository,
    // inspText.inspectGitRepository,
  );
  /* Maximum 45 to 50 words
   */
  const description: OfferingDescription = pd.items[10];
  await inspectText(
    ctx,
    op,
    description,
    inspText.inspectWordCountRange,
  );
  /* Unique link in the entire system of offering */
  const permaLink: OfferingPermaLink = pd.items[11];
  await inspectText(
    ctx,
    op,
    permaLink,
    // inspText.inspectPermaLink,
  );
  // TODO figure out if errors were encountered above and return invalid
  return lf.lhcFormInspectionSuccess(active.inspectionTarget);
}

async function inspectSocialPresence(
  ctx: lf.LhcFormInspectionContext<OfferingProfileLhcForm>,
  active: lf.LhcFormInspectionResult<OfferingProfileLhcForm>,
): Promise<lf.LhcFormInspectionResult<OfferingProfileLhcForm>> {
  const op = active.inspectionTarget;
  const sp: SocialPresence = op.items[2];
  /* Facebook URL, to be verified in Facebook
   * Validate with reference source site 
   */
  const facebookLink: SocialPresenceFacebookLink = sp.items[0];
  await inspectText(
    ctx,
    op,
    facebookLink,
    inspText.inspectWebsiteURL,
  );
  /* Twitter URL, to be verified in Twitter
   * Validate with reference source site 
   */
  const twitterLink: SocialPresenceTwitterLink = sp.items[1];
  await inspectText(
    ctx,
    op,
    twitterLink,
    inspText.inspectWebsiteURL,
  );
  /* LinkedIn URL, to be verified in LinkedIn
   * Validate with reference source site 
   */
  const linkedInLink: SocialPresenceLinkedInLink = sp.items[2];
  await inspectText(
    ctx,
    op,
    linkedInLink,
    inspText.inspectWebsiteURL,
  );
  /* Instagram URL, to be verified in Instagram
   * Validate with reference source site 
   */
  const instagramLink: SocialPresenceInstagramLink = sp.items[3];
  await inspectText(
    ctx,
    op,
    instagramLink,
    inspText.inspectWebsiteURL,
  );

  // TODO figure out if errors were encountered above and return invalid
  return lf.lhcFormInspectionSuccess(active.inspectionTarget);
}

async function inspectRespondantInformation(
  ctx: lf.LhcFormInspectionContext<OfferingProfileLhcForm>,
  active: lf.LhcFormInspectionResult<OfferingProfileLhcForm>,
): Promise<lf.LhcFormInspectionResult<OfferingProfileLhcForm>> {
  const op = active.inspectionTarget;
  const ri: RespondentContactInformation = op.items[0];
  // Check for the email verification using tools like https://email-checker.net
  const respondantEmail: RespondentEmailAddress = ri.items[1];
  await inspectText(
    ctx,
    op,
    respondantEmail,
    // inspText.inspectEmail,
  );

  // Check for the email verification using tools like https://email-checker.net
  const respondantVendorEmail: RespondentVendorEmailAddress = ri.items[4];
  await inspectText(
    ctx,
    op,
    respondantVendorEmail,
    // inspText.inspectEmail,
  );

  /* Check for US number formatting
   * Validate with reference source site if possible
   */
  const respondantContactNumber: RespondentContactPhoneNumber = ri.items[2];
  await inspectText(
    ctx,
    op,
    respondantContactNumber,
    // inspText.inspectPhone,
  );

  /* Check for US number formatting
   * Validate with reference source site if possible
   */
  const respondantVendorContact: RespondentVendorPhoneNumber = ri.items[5];
  await inspectText(
    ctx,
    op,
    respondantVendorContact,
    // inspText.inspectPhone,
  );

  // TODO figure out if errors were encountered above and return invalid
  return lf.lhcFormInspectionSuccess(active.inspectionTarget);
}

/**
 * OfferingProfileValidator is focused on testing values of fields. The 
 * OfferingProfileLhcForm can do all the structural validation but because
 * it is tightly tied to LCH Form JSON schema, we have to do values 
 * validation in this class instead of OfferingProfileLhcForm.
 */
export class OfferingProfileValidator {
  static readonly singleton = new OfferingProfileValidator();
  readonly inspectors = [
    inspectProductDetails,
    inspectSocialPresence,
    inspectRespondantInformation,
  ];

  async inspect(
    op: OfferingProfileLhcForm,
  ): Promise<[
    lf.TypicalLhcFormInspectionContext<OfferingProfileLhcForm>,
    insp.InspectionResult<OfferingProfileLhcForm>,
  ]> {
    const ctx = new lf.TypicalLhcFormInspectionContext(op);
    const ip = insp.inspectionPipe(ctx, ...this.inspectors);
    const result = await ip(ctx);
    return [ctx, result];
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
