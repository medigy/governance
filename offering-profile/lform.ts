import {
  govnData as gd,
  inspect as insp,
  inspText,
  nihLhcForms as lf,
} from "./deps.ts";
import * as lfih from "../lhc-form-inspect-helpers.ts";

export interface RespondentCompanyName extends lf.RequiredUniqueTextItem {
  readonly questionCode: "company-name";
  readonly localQuestionCode: "company-name";
  readonly question: "Name of the company providing this offering*";
  readonly noEmptyValue: true;
  readonly linkId: "/Q002/company-name";
  readonly codingInstructions: "Full name of the company including Inc, LLC";
  readonly codeList: [
    RespondentCompanyNameCodeList,
  ];
  readonly value: string;
}

export interface RespondentCompanyNameCodeList extends lf.FormItem {
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
    RespondentEmailAddresscCodeList,
  ];
  readonly value: string;
}

export interface RespondentEmailAddresscCodeList extends lf.FormItem {
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
    RespondentContactPhoneNumberCodeList,
  ];
  readonly value: string;
}

export interface RespondentContactPhoneNumberCodeList extends lf.FormItem {
  readonly code: "Q002-06";
  readonly display: "Contact number of the company*";
  readonly system: "http://loinc.org";
}

export interface RespondentVendorName extends lf.RequiredUniqueTextItem {
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

export type offeringRespondentSourceItemValue = lf.ConstrainedListItemValue;
/* The Constrained List values should come from the external OWL URL. 
 * Need to write function to get the list.
 */
export const offeringRespondentSourceContrainedListValues:
  offeringRespondentSourceItemValue[] = await lfih
    .getConstrainedListFromMedigyOntologyOWL(
      "https://proxy.ontology.attest.cloud/api/v1/sourceofinvitation/search",
    );

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
  readonly value: offeringRespondentSourceItemValue;
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

export type offeringTypeListItemValue = lf.ConstrainedListItemValue;
export const offeringTypeConstrainedListValues: offeringTypeListItemValue[] = [
  { code: "0", text: "Product" },
  { code: "1", text: "Solution" },
  { code: "2", text: "Service" },
];

export interface OfferingType extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-14";
  readonly localQuestionCode: "Q005-14";
  readonly question: "Type of offering*";
  readonly linkId: "/Q005/Q005-14";
  readonly codingInstructions: "Offering type as Product/ Solution/ Service";
  readonly codeList: [
    OfferingTypeCodeList,
  ];
  readonly value: offeringTypeListItemValue;
}

export interface OfferingTypeCodeList extends lf.FormItem {
  readonly code: "Q005-14";
  readonly display: "Type of offering*";
  readonly system: "http://loinc.org";
}

export type offeringOwnerCheckListItemValue = lf.ConstrainedListItemValue;
export const offeringOwnerConstrainedListValues:
  offeringOwnerCheckListItemValue[] = [
    { code: "Yes", text: "Yes" },
    { code: "No", text: "No" },
  ];

export interface OfferingOwnerCheck extends lf.ConstrainedListItem {
  readonly questionCode: "Q005-18";
  readonly localQuestionCode: "Q005-18";
  readonly question: "Are you the owner*";
  readonly linkId: "/Q005/Q005-18";
  readonly codeList: [
    OfferingOwnerCheckCodeList,
  ];
  readonly value: offeringOwnerCheckListItemValue;
}

export interface OfferingOwnerCheckCodeList extends lf.FormItem {
  readonly code: "Q005-18";
  readonly display: "Are you the owner*";
  readonly system: "http://loinc.org";
}

export type offeringTopicsItemValue = lf.ConstrainedListItemValue;
/* The Constrained List values should come from the external OWL URL. 
 * Need to write function to get the list.
 */
export const offeringTopicsContrainedListValues: offeringTopicsItemValue[] =
  await lfih.getConstrainedListFromMedigyOntologyOWL(
    "https://proxy.ontology.attest.cloud/api/v1/collection/search",
  );
// console.dir(OfferingTopicsContrainedListValues);
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
  readonly value: offeringTopicsItemValue[];
}

export interface OfferingTopicsCodeList extends lf.FormItem {
  readonly code: "Q005-01";
  readonly display: "Select the categories that best describe the offering*";
  readonly system: "http://loinc.org";
}

export interface OfferingName extends lf.RequiredUniqueTextItem {
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
export interface OfferingOneLinerDescription
  extends lf.UniqueMultiLineTextItem {
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

export type offeringFeaturedProductCheckListItemValue =
  lf.ConstrainedListItemValue;
export const offeringFeaturedProductConstrainedListValues:
  offeringFeaturedProductCheckListItemValue[] = [
    { code: "0", text: "Yes" },
    { code: "2", text: "No" },
  ];

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
  readonly value: offeringFeaturedProductCheckListItemValue;
}

export interface OfferingFeaturedProductCheckCodeList extends lf.FormItem {
  readonly code: "Q005-12";
  readonly display: "Feature Product";
  readonly system: "http://loinc.org";
}

export interface OfferingCreatedDate extends lf.UniqueDateItem {
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

// TODO: @Alan or @Geo please update this list and all constrained lists
export type offeringLicenseListItemValue = lf.ConstrainedListItemValue;
/* The Constrained List values should come from the external OWL URL. 
 * Need to write function to get the list.
 */
export const offeringLicenseContrainedListValues:
  offeringLicenseListItemValue[] = await lfih
    .getConstrainedListFromMedigyOntologyOWL(
      "https://proxy.ontology.attest.cloud/api/v1/license/search",
    );
export const offeringLicenseCommercial = offeringLicenseContrainedListValues[0];

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
  readonly value: offeringLicenseListItemValue;
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

export interface OfferingDescription extends lf.UniqueMultiLineTextItem {
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

export async function inspectProductDetails(
  target:
    | OfferingProfileLhcForm
    | lf.LhcFormInspectionResult<OfferingProfileLhcForm>,
): Promise<
  OfferingProfileLhcForm | lf.LhcFormInspectionResult<OfferingProfileLhcForm>
> {
  const opf: OfferingProfileLhcForm = lf.isLhcFormInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const pd: ProductDetails = opf.items[1];
  const diags = new lf.TypicalLhcFormInspectionDiags<OfferingProfileLhcForm>(
    insp.defaultInspectionContext(),
  );
  const ancestors = [pd];

  /* Validate the Offering Type User selected value
   * against the Offering Type Constrained List 
   */
  const offeringType: OfferingType = pd.items[0];
  diags.onFormItemInspection(
    opf,
    offeringType,
    lfih.inspectConstrainedListItemArrayValue(
      offeringType,
      offeringTypeConstrainedListValues,
      opf,
    ),
    ancestors,
  );

  /* Validate the Offering Owner Check User selected value
   * against the Offering Type Constrained List 
   */
  const offeringOwnerCheck: OfferingOwnerCheck = pd.items[1];
  diags.onFormItemInspection(
    opf,
    offeringOwnerCheck,
    lfih.inspectConstrainedListItemArrayValue(
      offeringOwnerCheck,
      offeringOwnerConstrainedListValues,
      opf,
    ),
    ancestors,
  );

  /* Validate the Offering Topics selected value
   * against the Offering Topics Constrained List 
   */
  const offeringTopics: OfferingTopics = pd.items[2];
  await diags.onFormItemInspection(
    opf,
    offeringTopics,
    lfih.inspectConstrainedListItemArrayValue(
      offeringTopics,
      offeringTopicsContrainedListValues,
      opf,
    ),
    ancestors,
  );

  /* Validate the Offering Name against null value */
  const offeringName: OfferingName = pd.items[3];
  diags.onFormItemInspection(
    opf,
    offeringName,
    lfih.inspectRequiredFormItem(opf, offeringName),
    ancestors,
  );

  const oneLiner: OfferingOneLinerDescription = pd.items[4];
  diags.onFormItemInspection(
    opf,
    oneLiner,
    await inspText.inspectWordCountRange(
      oneLiner.value,
      insp.inspectionContext<inspText.InspectWordCountRangeSupplier>({
        inspectWordCountRange: insp.numericRange(10, 15),
      }),
    ),
    ancestors,
  );

  /* Validate the Offering Owner Check User selected value
   * against the Offering Type Constrained List 
   */
  const offeringFeaturedProductCheck: OfferingFeaturedProductCheck =
    pd.items[5];
  diags.onFormItemInspection(
    opf,
    offeringFeaturedProductCheck,
    lfih.inspectConstrainedListItemArrayValue(
      offeringFeaturedProductCheck,
      offeringFeaturedProductConstrainedListValues,
      opf,
    ),
    ancestors,
  );

  /* Validate the Offering Created Date against null value */
  const createdDate: OfferingCreatedDate = pd.items[6];
  diags.onFormItemInspection(
    opf,
    createdDate,
    lfih.inspectRequiredFormItem(opf, createdDate),
    ancestors,
  );

  const websiteURL: OfferingWebsite = pd.items[7];
  diags.onFormItemInspection(
    opf,
    websiteURL,
    await inspText.inspectWebsiteURL(websiteURL.value),
    ancestors,
  );

  /* Validate with reference source site */
  // TODO: @Alan or @Geo please set OfferingLicense.value to specific constrained list
  //       which allows us to check the value; if you cannot figure it out quickly, ask
  //       @Shahid for help.

  /* Validate the Offering License selected value
   * against the Offering License Constrained List 
   */
  const offeringLicense: OfferingLicense = pd.items[8];
  diags.onFormItemInspection(
    opf,
    offeringLicense,
    lfih.inspectConstrainedListItemArrayValue(
      offeringLicense,
      offeringLicenseContrainedListValues,
      opf,
    ),
    ancestors,
  );

  /* Mandatory if "License Of The Offering" is Open Source
     * GIT URL of the offering repository
     * Validate with reference source site
     */
  const gitRepository: OfferingGitRepository = pd.items[9];
  if (
    lfih.isConstrainedListItemNotSingleValue(
      offeringLicense,
      offeringLicenseCommercial,
    )
  ) {
    diags.onFormItemInspection(
      opf,
      gitRepository,
      await inspText.inspectWebsiteURL(gitRepository.value),
      ancestors,
    );
  }

  const description: OfferingDescription = pd.items[10];
  diags.onFormItemInspection(
    opf,
    description,
    await inspText.inspectWordCountRange(
      description.value,
      insp.inspectionContext<inspText.InspectWordCountRangeSupplier>({
        inspectWordCountRange: insp.numericRange(15, 50),
      }),
    ),
    ancestors,
  );

  const permaLink: OfferingPermaLink = pd.items[11];
  diags.onFormItemInspection(
    opf,
    permaLink,
    lfih.inspectRequiredFormItem(opf, permaLink),
    ancestors,
  );

  return diags.inspectionIssues.length > 0
    ? insp.mergeDiagsIntoIssue(target, diags)
    : target;
}

export async function inspectSocialPresence(
  target:
    | OfferingProfileLhcForm
    | lf.LhcFormInspectionResult<OfferingProfileLhcForm>,
): Promise<
  OfferingProfileLhcForm | lf.LhcFormInspectionResult<OfferingProfileLhcForm>
> {
  const opf: OfferingProfileLhcForm = lf.isLhcFormInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const sp: SocialPresence = opf.items[2];
  const ancestors = [sp];
  const diags = new lf.TypicalLhcFormInspectionDiags<OfferingProfileLhcForm>(
    insp.defaultInspectionContext(),
  );
  /* Facebook URL, to be verified in Facebook
   * Validate with reference source site 
   */
  const facebookLink: SocialPresenceFacebookLink = sp.items[0];
  diags.onFormItemInspection(
    opf,
    facebookLink,
    await lfih.inspectOptionalFacebookURL(facebookLink.value),
    ancestors,
  );
  /* Twitter URL, to be verified in Twitter
   * Validate with reference source site 
   */
  const twitterLink: SocialPresenceTwitterLink = sp.items[1];
  diags.onFormItemInspection(
    opf,
    twitterLink,
    await lfih.inspectOptionalTwitterURL(twitterLink.value),
    ancestors,
  );
  /* LinkedIn URL, to be verified in LinkedIn
   * Validate with reference source site 
   */
  const linkedInLink: SocialPresenceLinkedInLink = sp.items[2];
  diags.onFormItemInspection(
    opf,
    linkedInLink,
    await lfih.inspectOptionalLinkedInURL(linkedInLink.value),
    ancestors,
  );
  /* Instagram URL, to be verified in Instagram
   * Validate with reference source site 
   */
  const instagramLink: SocialPresenceInstagramLink = sp.items[3];
  diags.onFormItemInspection(
    opf,
    instagramLink,
    await lfih.inspectOptionalInstagramURL(instagramLink.value),
    ancestors,
  );

  return diags.inspectionIssues.length > 0
    ? insp.mergeDiagsIntoIssue(target, diags)
    : target;
}

export async function inspectRespondentContactInformation(
  target:
    | OfferingProfileLhcForm
    | lf.LhcFormInspectionResult<OfferingProfileLhcForm>,
): Promise<
  OfferingProfileLhcForm | lf.LhcFormInspectionResult<OfferingProfileLhcForm>
> {
  const opf: OfferingProfileLhcForm = lf.isLhcFormInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const rci: RespondentContactInformation = opf.items[0];
  const ancestors = [rci];
  const diags = new lf.TypicalLhcFormInspectionDiags<OfferingProfileLhcForm>(
    insp.defaultInspectionContext(),
  );

  /* Validate the Company Name against null value */
  const respondentCompanyName: RespondentCompanyName = rci.items[0];
  diags.onFormItemInspection(
    opf,
    respondentCompanyName,
    lfih.inspectRequiredFormItem(opf, respondentCompanyName),
    ancestors,
  );

  /* Validate the Vendor Name against null value */
  const respondentVendorName: RespondentVendorName = rci.items[3];
  diags.onFormItemInspection(
    opf,
    respondentVendorName,
    lfih.inspectRequiredFormItem(opf, respondentVendorName),
    ancestors,
  );

  // Check for the email verification using tools like https://email-checker.net
  const respondentEmail: RespondentEmailAddress = rci.items[1];
  diags.onFormItemInspection(
    opf,
    respondentEmail,
    await lfih.inspectEmailAddress(respondentEmail.value),
    ancestors,
  );
  // Check for the email verification using tools like https://email-checker.net
  const respondentVendorEmail: RespondentVendorEmailAddress = rci.items[4];
  diags.onFormItemInspection(
    opf,
    respondentVendorEmail,
    await lfih.inspectEmailAddress(respondentVendorEmail.value),
    ancestors,
  );
  /* Check for US number formatting
   * Validate with reference source site if possible
   */
  const respondentContactNumber: RespondentContactPhoneNumber = rci.items[2];
  diags.onFormItemInspection(
    opf,
    respondentContactNumber,
    await lfih.inspectPhoneNumberUSFormat(respondentContactNumber.value),
    ancestors,
  );
  /* Check for US number formatting
   * Validate with reference source site if possible
   */
  const respondentVendorContact: RespondentVendorPhoneNumber = rci.items[5];
  diags.onFormItemInspection(
    opf,
    respondentVendorContact,
    await lfih.inspectPhoneNumberUSFormat(respondentVendorContact.value),
    ancestors,
  );
  /* Validate the Respondent Source of Invitation selected value
   * against the Respondent Source of Invitation Constrained List 
   */
  const respondentSource: RespondentSource = rci.items[6];
  diags.onFormItemInspection(
    opf,
    respondentSource,
    lfih.inspectConstrainedListItemArrayValue(
      respondentSource,
      offeringRespondentSourceContrainedListValues,
      opf,
    ),
    ancestors,
  );

  return diags.inspectionIssues.length > 0
    ? insp.mergeDiagsIntoIssue(target, diags)
    : target;
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
    inspectRespondentContactInformation,
  ];

  async inspect(
    opf: OfferingProfileLhcForm,
  ): Promise<lf.LhcFormInspectionDiagnostics<OfferingProfileLhcForm>> {
    const diags = new lf.TypicalLhcFormInspectionDiags<
      OfferingProfileLhcForm
    >(lf.lhcFormInspectionPipeContent());
    const ip = lf.lhcFormInspectionPipe(...this.inspectors);
    await ip(opf, diags);
    return diags;
  }

  async inspectConsole(
    opf: OfferingProfileLhcForm,
  ): Promise<void> {
    const diags = new lf.ConsoleLhcFormInspectionDiags<
      OfferingProfileLhcForm
    >(
      new lf.TypicalLhcFormInspectionDiags(lf.lhcFormInspectionPipeContent()),
      true,
    );
    const ip = lf.lhcFormInspectionPipe(...this.inspectors);
    await ip(opf, diags);
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
      medigyGovnModuleImportDirective: string;
    },
  ) {
    super(gd.defaultTypicalJsonTyperOptions(
      [
        options.govnDataModuleImportDirective,
        options.medigyGovnModuleImportDirective,
      ],
      "medigyGovn.offerProfile.lf.OfferingProfileLhcForm",
      {
        instanceName: "profile",
        emittedFileExtn: ".lhc-form.auto.ts",
        govnDataImportURL: options.govnDataModuleRef,
        inspectorPropertyTS:
          "dataInspector: async () => { medigyGovn.offerProfile.lf.OfferingProfileValidator.singleton.inspectConsole(profile) }",
      },
    ));
  }
}
