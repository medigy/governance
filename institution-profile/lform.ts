import {
  govnData as gd,
  inspect as insp,
  inspText,
  nihLhcForms as lf,
} from "./deps.ts";
import * as lfih from "../lhc-form-inspect-helpers.ts";

export interface CompanyProfile extends lf.ConstrainedListItem {
  readonly questionCode: "002-01-01";
  readonly localQuestionCode: "002-01-01";
  readonly question: "You are*";
  readonly value: lf.ConstrainedListItemValue;
  readonly linkId: "/002-01-01";
  readonly codingInstructions: "Select from the given list - Vendor or Buyer";
}
export type companyProfileListItemValue = lf.ConstrainedListItemValue;
export const companyProfileConstrainedListValues:
  companyProfileListItemValue[] = [
    { code: "002-01-01-01", text: "Vendor" },
    { code: "002-01-01-02", text: "Buyer" },
  ];

export interface JobTitle extends lf.ExtensibleConstrainedListItem {
  readonly questionCode: "002-01-02";
  readonly localQuestionCode: "002-01-02";
  readonly question: "Your Job Title*";
  readonly value: lf.ConstrainedListItemValue;
  readonly linkId: "/002-01-02";
  readonly codingInstructions: "Select from the given list";
}
export type jobTitleListItemValue = lf.ConstrainedListItemValue;
export const jobTitleConstrainedListValues: jobTitleListItemValue[] = [
  { code: "002-01-02-01", text: "Accounting" },
  { code: "002-01-02-02", text: "Human Resources" },
  { code: "002-01-02-03", text: "Finance" },
  {
    code: "002-01-02-04",
    text: "Information Technology(IT) and Digital Media",
  },
  { code: "002-01-02-05", text: "Insurance Job Title" },
];

export interface CompanyName extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-01-04";
  readonly localQuestionCode: "002-01-04";
  readonly question: "Company Name*";
  readonly value: string;
  readonly linkId: "/002-01-04";
  readonly codingInstructions:
    "Full name of the institution including Inc, LLC";
}

export interface CompanyDescription extends lf.UniqueMultiLineTextItem {
  readonly questionCode: "002-01-11";
  readonly question: "Company Description";
  readonly value?: string;
  readonly linkId: "/002-01-11";
}

export interface DateofIncorporation extends lf.UniqueDateItem {
  readonly questionCode: "002-01-05";
  readonly localQuestionCode: "002-01-05";
  readonly question: "Date of Incorporation*";
  readonly value: string;
  readonly linkId: "/002-01-05";
  readonly codingInstructions:
    "Institution Incorporation date in mm/dd/yyyy format";
}
export interface CompanyType extends lf.ConstrainedListItem {
  readonly questionCode: "002-01-06";
  readonly localQuestionCode: "002-01-06";
  readonly question: "Company Type*";
  readonly value: lf.ConstrainedListItemValue;
  readonly linkId: "/002-01-06";
  readonly codingInstructions: "Select from the given list";
}
export type companyTypeListItemValue = lf.ConstrainedListItemValue;
export const companyTypeConstrainedListValues: companyTypeListItemValue[] = [
  { code: "002-01-06-01", text: "Royal Chartered Companies" },
  { code: "002-01-06-09", text: "Statutory Companies" },
  { code: "002-01-06-02", text: "Registered or Incorporated Companies" },
  {
    code: "002-01-06-03",
    text: "Companies Limited By Shares",
  },
  { code: "002-01-06-04", text: "Companies Limited By Guarantee" },
  { code: "002-01-06-05", text: "Unlimited Companies" },
  { code: "002-01-06-06", text: "Public Company (or Public Limited Company)" },
  {
    code: "002-01-06-07",
    text: "Private Company (or Private Limited Company)",
  },
  { code: "002-01-06-08", text: "One Person Company" },
];

export interface RegistrationNumber extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-01-07";
  readonly question: "Registration Number*";
  readonly value?: string;
  readonly linkId: "/002-01-07";
  readonly codingInstructions: "Institution registration number";
}
export interface Industry extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-01-08";
  readonly localQuestionCode: "002-01-08";
  readonly question: "Industry";
  readonly value: string;
  readonly linkId: "/002-01-08";
  readonly codingInstructions: "Type of industry the institution belongs";
}
export interface Currency extends lf.UniqueCurrencyItem {
  readonly questionCode: "002-01-09";
  readonly localQuestionCode: "002-01-09";
  readonly question: "Currency";
  readonly value?: string;
  readonly linkId: "/002-01-09";
  readonly codingInstructions:
    "Currency in which institution primarily dealing";
}
export interface NetWorth extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-01-10";
  readonly localQuestionCode: "002-01-10";
  readonly question: "Net Worth";
  readonly value?: string;
  readonly linkId: "/002-01-10";
  readonly codingInstructions: "Networth of the institution";
}
export interface CompanySize extends lf.ExtensibleConstrainedListItem {
  readonly questionCode: "002-01-12";
  readonly localQuestionCode: "002-01-12";
  readonly question: "Company Size*";
  readonly value: lf.ConstrainedListItemValue;
  readonly linkId: "/002-01-12";
  readonly codingInstructions: "Select from the given list";
}
export type companySizeListItemValue = lf.ConstrainedListItemValue;
export const companySizeConstrainedListValues: companySizeListItemValue[] = [
  { code: "002-01-12-01", text: "0-50" },
  { code: "002-01-12-02", text: "51-200" },
  { code: "002-01-12-03", text: "201-500" },
  {
    code: "002-01-12-04",
    text: "501-2000",
  },
  {
    code: "002-01-12-05",
    text: "&lt;2000",
  },
];
export interface ContactDetails extends lf.FormItem {
  readonly header: true;
  readonly question: "Contact Details";
  readonly questionCode: "002-02-00";
  readonly items: [
    Website,
    WorkEmail,
    WorkPhone,
    AlternatePhone,
  ];
}

export interface Website extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-02-01";
  readonly localQuestionCode: "002-02-01";
  readonly question: "Website*";
  readonly value: string;
  readonly linkId: "/002-02-01";
  readonly codingInstructions: "Institution website url";
}
export interface WorkEmail extends lf.UniqueEmailAddressItem {
  readonly questionCode: "002-02-02";
  readonly localQuestionCode: "002-02-02";
  readonly question: "Work Email*";
  readonly value: string;
  readonly linkId: "/002-02-02";
  readonly codingInstructions: "Institution contact email id";
}
export interface WorkPhone extends lf.UniquePhoneItem {
  readonly questionCode: "002-02-03";
  readonly localQuestionCode: "002-02-03";
  readonly question: "Work Phone*";
  readonly value: string;
  readonly linkId: "/002-02-03";
  readonly codingInstructions: "Institution contact phone number";
}
export interface AlternatePhone extends lf.UniquePhoneItem {
  readonly questionCode: "002-02-04";
  readonly localQuestionCode: "002-02-04";
  readonly question: "Another Phone";
  readonly value?: string;
  readonly linkId: "/002-02-04";
  readonly codingInstructions: "Alternate phone for contacting the institution";
}

export interface InvitationSource extends lf.ConstrainedListItem {
  readonly questionCode: "Q002-02-11";
  readonly localQuestionCode: "Q002-02-11";
  readonly question: "Source of Invitation";
  readonly value?: lf.ConstrainedListItemValue;
  readonly linkId: "/Q002-02-11";
  readonly codingInstructions:
    "The source through which this institution is invited to Medigy. Select from the given list; if blank choose 'www.medigy.com'";
}

export type sourceOfInvitationListItemValue = lf.ConstrainedListItemValue;
export const sourceOfInvitationConstrainedListValues:
  sourceOfInvitationListItemValue[] = await lfih
    .getConstrainedListFromMedigyOntologyOWL(
      "https://proxy.ontology.attest.cloud/api/v1/sourceofinvitation/search",
    );

export interface CrmIdentifier extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-02-12";
  readonly localQuestionCode: "002-02-12";
  readonly question: "CRM Identifier";
  readonly value?: string;
  readonly linkId: "/002-02-12";
}

export interface GithubInformation extends lf.FormItem {
  readonly header: true;
  readonly question: "Github Details";
  readonly items: [
    GithubUserName,
    GithubPassword,
    GithubClientId,
    GithubClientSecret,
    GithubOwner,
    GithubRepo,
  ];
}
export interface GithubUserName extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-03-01";
  readonly localQuestionCode: "002-03-01";
  readonly question: "Github UserName";
  readonly value?: string;
  readonly linkId: "/002-02-05/002-02-06";
}
export interface GithubPassword extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-03-02";
  readonly localQuestionCode: "002-03-02";
  readonly question: "Github Password";
  readonly value?: string;
  readonly linkId: "/002-02-05/002-02-07";
}
export interface GithubClientId extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-03-03";
  readonly localQuestionCode: "002-03-03";
  readonly question: "Github Client ID";
  readonly value?: string;
  readonly linkId: "/002-03-03";
}
export interface GithubClientSecret extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-03-04";
  readonly localQuestionCode: "002-03-04";
  readonly question: "Github Client Secret";
  readonly value?: string;
  readonly linkId: "/002-03-04";
}
export interface GithubOwner extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-03-05";
  readonly localQuestionCode: "002-03-05";
  readonly question: "Github Owner";
  readonly value?: string;
  readonly linkId: "/002-03-05";
}
export interface GithubRepo extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-03-06";
  readonly localQuestionCode: "002-03-06";
  readonly question: "Github Repo";
  readonly value?: string;
  readonly linkId: "/002-03-06";
}

export interface CompanyAddress extends lf.ContactAddressItem {
  readonly header: true;
  readonly question: "Company Address";
  readonly items: [
    HouseOrBuilding,
    TownOrCity,
    StateOrProvince,
    ZipOrPostal,
    CountryOrRegion,
  ];
}

export interface HouseOrBuilding extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-02-06";
  readonly localQuestionCode: "002-02-06";
  readonly question: "House/Building*";
  readonly value: string;
  readonly linkId: "/002-02-05/002-02-06";
  readonly codingInstructions:
    "House/Building name in the physical address of the institution";
}

export interface TownOrCity extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-02-07";
  readonly localQuestionCode: "002-02-07";
  readonly question: "Town/City*";
  readonly value: string;
  readonly linkId: "/002-02-05/002-02-07";
  readonly codingInstructions:
    "Town/City in the physical address of the institution";
}
export interface StateOrProvince extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-02-08";
  readonly localQuestionCode: "002-02-08";
  readonly question: "State/Province*";
  readonly value: string;
  readonly linkId: "/002-02-05/002-02-08";
  readonly codingInstructions:
    "State/Province in the physical address of the institution";
}
export interface ZipOrPostal extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-02-09";
  readonly localQuestionCode: "002-02-09";
  readonly question: "ZIP/Postal Code*";
  readonly value: string;
  readonly linkId: "/002-02-05/002-02-09";
  readonly codingInstructions:
    "ZIP/Postal Code in the physical address of the institution";
}
export interface CountryOrRegion extends lf.RequiredUniqueTextItem {
  readonly questionCode: "002-02-10";
  readonly localQuestionCode: "002-02-10";
  readonly question: "Country/Region*";
  readonly value: string;
  readonly linkId: "/002-02-05/002-02-10";
  readonly codingInstructions:
    "Country/Region in the physical address of the institution";
}

export interface InstitutionProfileLhcForm extends lf.NihLhcForm {
  readonly items: [
    CompanyProfile,
    JobTitle,
    CompanyName,
    CompanyDescription,
    DateofIncorporation,
    CompanyType,
    RegistrationNumber,
    Industry,
    Currency,
    NetWorth,
    CompanySize,
    ContactDetails,
    CompanyAddress,
    InvitationSource,
    CrmIdentifier,
    GithubInformation,
  ];
}

export async function inspectInstitutionProfile(
  target:
    | InstitutionProfileLhcForm
    | lf.LhcFormInspectionResult<InstitutionProfileLhcForm>,
): Promise<
  | InstitutionProfileLhcForm
  | lf.LhcFormInspectionResult<InstitutionProfileLhcForm>
> {
  const opf: InstitutionProfileLhcForm = lf.isLhcFormInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const diags = new lf.TypicalLhcFormInspectionDiags<InstitutionProfileLhcForm>(
    insp.defaultInspectionContext(),
  );
  /* Validate the Company profile */
  const companyProfile: CompanyProfile = opf.items[0];
  diags.onFormItemInspection(
    opf,
    companyProfile,
    lfih.inspectRequiredConstrainedListItemArrayValue(
      companyProfile,
      companyProfileConstrainedListValues,
      opf,
    ),
  );

  /* Validate the Company Job Title */
  const jobTitle: JobTitle = opf.items[1];
  diags.onFormItemInspection(
    opf,
    jobTitle,
    lfih.inspectRequiredConstrainedListItemArrayValue(
      jobTitle,
      jobTitleConstrainedListValues,
      opf,
    ),
  );

  /* Validate the Company Name for null value */
  const companyName: CompanyName = opf.items[2];
  diags.onFormItemInspection(
    opf,
    companyName,
    lfih.inspectRequiredFormItem(opf, companyName),
  );

  /* Validate the Company Description for null value */
  const companyDescription: CompanyDescription = opf.items[3];
  diags.onFormItemInspection(
    opf,
    companyDescription,
    lfih.inspectRequiredFormItem(opf, companyDescription),
  );

  /* Validate the Company Date of Incorporation for null value */
  const dateofIncorporation: DateofIncorporation = opf.items[4];
  diags.onFormItemInspection(
    opf,
    dateofIncorporation,
    lfih.inspectRequiredFormItem(opf, dateofIncorporation),
  );

  /* Validate the Company Type */
  const companyType: CompanyType = opf.items[5];
  diags.onFormItemInspection(
    opf,
    companyType,
    lfih.inspectRequiredConstrainedListItemArrayValue(
      companyType,
      companyTypeConstrainedListValues,
      opf,
    ),
  );

  /* Validate the Registration Number for null value */
  const registrationNumber: RegistrationNumber = opf.items[6];
  diags.onFormItemInspection(
    opf,
    registrationNumber,
    lfih.inspectRequiredFormItem(opf, registrationNumber),
  );

  /* Validate the Industry Type for null value */
  const industry: Industry = opf.items[7];
  diags.onFormItemInspection(
    opf,
    industry,
    lfih.inspectRequiredFormItem(opf, industry),
  );

  /* Validate the Currency for invalid currency value */
  const currency: Currency = opf.items[8];
  diags.onFormItemInspection(
    opf,
    currency,
    lfih.inspectOptionalCurrencyFormItem(opf, currency),
  );

  /* Commenting the below rule as the 
   * Networth field is not mandatory.
   */
  // /* Validate the Company Networth for null value */
  // const netWorth: NetWorth = opf.items[9];
  // diags.onFormItemInspection(
  //   opf,
  //   netWorth,
  //   lfih.inspectRequiredFormItem(opf, netWorth),
  // );

  /* Validate the Company Size */
  const companySize: CompanySize = opf.items[10];
  diags.onFormItemInspection(
    opf,
    companySize,
    lfih.inspectRequiredConstrainedListItemArrayValue(
      companySize,
      companySizeConstrainedListValues,
      opf,
    ),
  );

  /* Validate the Company Source of invitation */
  const sourceOfInvitation: InvitationSource = opf.items[13];
  diags.onFormItemInspection(
    opf,
    sourceOfInvitation,
    lfih.inspectOptionalConstrainedListItemArrayValue(
      sourceOfInvitation,
      sourceOfInvitationConstrainedListValues,
      opf,
    ),
  );

  /* Validate the Company CRM identifier */
  const crmIdentifier: CrmIdentifier = opf.items[14];
  diags.onFormItemInspection(
    opf,
    crmIdentifier,
    lfih.inspectRequiredFormItem(opf, crmIdentifier),
  );

  const cd: ContactDetails = opf.items[11];
  const ancestorsContact = [cd];

  /* validate the company website */
  const website: Website = cd.items[0];
  diags.onFormItemInspection(
    opf,
    website,
    await inspText.inspectWebsiteURL(website.value),
    ancestorsContact,
  );

  /* validate the company work email */
  const workEmail: WorkEmail = cd.items[1];
  diags.onFormItemInspection(
    opf,
    workEmail,
    lfih.inspectEmailAddress(workEmail.value),
    ancestorsContact,
  );

  /* validate the company work phone */
  const workPhone: WorkPhone = cd.items[2];
  diags.onFormItemInspection(
    opf,
    workPhone,
    await lfih.inspectRequiredPhoneNumberUSFormat(workPhone.value),
    ancestorsContact,
  );

  /* validate the company another Phone */
  const alternatePhone: AlternatePhone = cd.items[3];
  diags.onFormItemInspection(
    opf,
    alternatePhone,
    await lfih.inspectOptionalPhoneNumberUSFormat(alternatePhone.value),
    ancestorsContact,
  );

  const ca: CompanyAddress = opf.items[12];
  const ancestorsAddress = [ca];

  /* validate the company house/building address */
  const houseOrBuilding: HouseOrBuilding = ca.items[0];
  diags.onFormItemInspection(
    opf,
    houseOrBuilding,
    lfih.inspectRequiredFormItem(opf, houseOrBuilding),
    ancestorsAddress,
  );

  /* validate the company town/city address */
  const townOrCity: TownOrCity = ca.items[1];
  diags.onFormItemInspection(
    opf,
    townOrCity,
    lfih.inspectRequiredFormItem(opf, townOrCity),
    ancestorsAddress,
  );

  /* validate the company state/province address */
  const stateOrProvince: StateOrProvince = ca.items[2];
  diags.onFormItemInspection(
    opf,
    stateOrProvince,
    lfih.inspectRequiredFormItem(opf, stateOrProvince),
    ancestorsAddress,
  );

  /* validate the company state/province address */
  const zipOrPostal: ZipOrPostal = ca.items[3];
  diags.onFormItemInspection(
    opf,
    zipOrPostal,
    lfih.inspectRequiredFormItem(opf, zipOrPostal),
    ancestorsAddress,
  );

  /* validate the company country/region address */
  const countryOrRegion: CountryOrRegion = ca.items[4];
  diags.onFormItemInspection(
    opf,
    countryOrRegion,
    lfih.inspectRequiredFormItem(opf, countryOrRegion),
    ancestorsAddress,
  );

  const gi: GithubInformation = opf.items[15];
  const ancestorsGit = [gi];
  /* Commenting the below rules as the 
   * GITHUB details are not mandatory.
   */
  // /* validate the company github username */
  // const githubUserName: GithubUserName = gi.items[0];
  // diags.onFormItemInspection(
  //   opf,
  //   githubUserName,
  //   lfih.inspectRequiredFormItem(opf, githubUserName),
  //   ancestorsGit,
  // );

  // /* validate the company github username */
  // const githubPassword: GithubPassword = gi.items[1];
  // diags.onFormItemInspection(
  //   opf,
  //   githubPassword,
  //   lfih.inspectRequiredFormItem(opf, githubPassword),
  //   ancestorsGit,
  // );

  // /* validate the company github client Id */
  // const githubClientId: GithubClientId = gi.items[2];
  // diags.onFormItemInspection(
  //   opf,
  //   githubClientId,
  //   lfih.inspectRequiredFormItem(opf, githubClientId),
  //   ancestorsGit,
  // );

  // /* validate the company github client Secret */
  // const githubClientSecret: GithubClientSecret = gi.items[3];
  // diags.onFormItemInspection(
  //   opf,
  //   githubClientSecret,
  //   lfih.inspectRequiredFormItem(opf, githubClientSecret),
  //   ancestorsGit,
  // );

  // /* validate the company github client Owner */
  // const githubOwner: GithubOwner = gi.items[4];
  // diags.onFormItemInspection(
  //   opf,
  //   githubOwner,
  //   lfih.inspectRequiredFormItem(opf, githubOwner),
  //   ancestorsGit,
  // );

  // /* validate the company github client Owner */
  // const githubRepo: GithubRepo = gi.items[5];
  // diags.onFormItemInspection(
  //   opf,
  //   githubRepo,
  //   lfih.inspectRequiredFormItem(opf, githubRepo),
  //   ancestorsGit,
  // );

  return diags.inspectionIssues.length > 0
    ? insp.mergeDiagsIntoIssue(target, diags)
    : target;
}

/**
 * InstitutionProfileValidator is focused on testing values of fields. The 
 * InstitutionProfileLhcForm can do all the structural validation but because
 * it is tightly tied to LCH Form JSON schema, we have to do values 
 * validation in this class instead of InstitutionProfileLhcForm.
 */
export class InstitutionProfileValidator {
  static readonly singleton = new InstitutionProfileValidator();
  readonly inspectors = [
    inspectInstitutionProfile,
  ];

  async inspect(
    opf: InstitutionProfileLhcForm,
  ): Promise<lf.LhcFormInspectionDiagnostics<InstitutionProfileLhcForm>> {
    const diags = new lf.TypicalLhcFormInspectionDiags<
      InstitutionProfileLhcForm
    >(lf.lhcFormInspectionPipeContent());
    const ip = lf.lhcFormInspectionPipe(...this.inspectors);
    await ip(opf, diags);
    return diags;
  }

  async inspectConsole(
    opf: InstitutionProfileLhcForm,
  ): Promise<void> {
    const diags = new lf.ConsoleLhcFormInspectionDiags<
      InstitutionProfileLhcForm
    >(
      new lf.TypicalLhcFormInspectionDiags(lf.lhcFormInspectionPipeContent()),
      true,
    );
    const ip = lf.lhcFormInspectionPipe(...this.inspectors);
    await ip(opf, diags);
  }
}
/**
 * InstitutionProfileLhcFormJsonTyper takes an LHC Form JSON file and "types"
 * it as a Medigy Institution Profile. Once "typed" an LHC Form may be validated
 * by the TypeScript compiler.
 */
export class InstitutionProfileLhcFormJsonTyper extends gd.TypicalJsonTyper {
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
      "medigyGovn.instiProfile.lf.InstitutionProfileLhcForm",
      {
        instanceName: "profile",
        emittedFileExtn: ".lhc-form.auto.ts",
        govnDataImportURL: options.govnDataModuleRef,
        inspectorPropertyTS:
          "dataInspector: async () => { medigyGovn.instiProfile.lf.InstitutionProfileValidator.singleton.inspectConsole(profile) }",
      },
    ));
  }
}
