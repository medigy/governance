import {
  govnData as gd,
  inspect as insp,
  inspText,
  nihLhcForms as lf,
} from "./deps.ts";

export interface CompanyProfile extends lf.ConstrainedListItem {
  readonly questionCode: "002-01-01";
  readonly localQuestionCode: "002-01-01";
  readonly question: "You are*";
  readonly value: lf.ConstrainedListItemValue;
  readonly linkId: "/002-01-01";
  readonly codingInstructions: "Select from the given list - Vendor or Buyer";
}

export interface JobTitle extends lf.ExtensibleConstrainedListItem {
  readonly questionCode: "002-01-02";
  readonly localQuestionCode: "002-01-02";
  readonly question: "Your Job Title*";
  readonly value: lf.ConstrainedListItemValue;
  readonly linkId: "/002-01-02";
  readonly codingInstructions: "Select from the given list";
}

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

async function inspectText(
  lformCtx: lf.LhcFormInspectionContext<InstitutionProfileLhcForm>,
  form: InstitutionProfileLhcForm,
  item: lf.FormItem,
  ...inspectors: inspText.TextInspector[]
): Promise<void> {
  if (!item.value) {
    // TODO: if this is required, need to add error
    return;
  }
  const itCtx = new inspText.DerivedTextInspectionContext(
    form,
    lformCtx,
  );
  const ip = insp.inspectionPipe(...inspectors);
  await ip(
    itCtx,
    inspText.textInspectionTarget(item.value.toString()),
  );
}

async function inspectInstitutionProfile(
  ctx: lf.LhcFormInspectionContext<InstitutionProfileLhcForm>,
  active: lf.LhcFormInspectionResult<InstitutionProfileLhcForm>,
): Promise<lf.LhcFormInspectionResult<InstitutionProfileLhcForm>> {
  const op = active.inspectionTarget;
  const cd: ContactDetails = op.items[11];
  const website: Website = cd.items[0];
  await inspectText(
    ctx,
    op,
    website,
    inspText.inspectWebsiteURL,
  );
  const workEmail: WorkEmail = cd.items[1];
  await inspectText(
    ctx,
    op,
    workEmail,
    // inspText.inspectEmail,
  );
  const workPhone: WorkPhone = cd.items[2];
  await inspectText(
    ctx,
    op,
    workPhone,
    // inspText.inspectPhone,
  );
  const ca: CompanyAddress = op.items[12];
  const houseOrBuilding: HouseOrBuilding = ca.items[0];
  await inspectText(
    ctx,
    op,
    houseOrBuilding,
    // inspText.inspectAddressHouseBuilding,
  );
  const townOrCity: TownOrCity = ca.items[1];
  await inspectText(
    ctx,
    op,
    townOrCity,
    // inspText.inspectAddressTownCity,
  );
  const stateOrProvince: StateOrProvince = ca.items[2];
  await inspectText(
    ctx,
    op,
    stateOrProvince,
    // inspText.inspectAddressStateProvince,
  );
  const zipOrPostal: ZipOrPostal = ca.items[3];
  await inspectText(
    ctx,
    op,
    zipOrPostal,
    // inspText.inspectAddressZipCode,
  );
  const countryOrRegion: CountryOrRegion = ca.items[4];
  await inspectText(
    ctx,
    op,
    countryOrRegion,
    // inspText.inspectAddressCountryRegion,
  );

  return active;
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
    op: InstitutionProfileLhcForm,
  ): Promise<[
    lf.TypicalLhcFormInspectionContext<InstitutionProfileLhcForm>,
    insp.InspectionResult<InstitutionProfileLhcForm>,
  ]> {
    const ctx = new lf.TypicalLhcFormInspectionContext<
      InstitutionProfileLhcForm
    >();
    const ip = insp.inspectionPipe(...this.inspectors);
    const result = await ip(ctx, op);
    return [ctx, result];
  }

  async inspectConsole(
    op: InstitutionProfileLhcForm,
  ): Promise<void> {
    const ctx = new lf.ConsoleLhcFormInspectionContext<
      InstitutionProfileLhcForm
    >(true);
    const ip = insp.inspectionPipe(...this.inspectors);
    await ip(ctx, op);
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
      medigyGovnModuleTypeImportDirective: string;
    },
  ) {
    super(gd.defaultTypicalJsonTyperOptions(
      [
        options.govnDataModuleImportDirective,
        options.medigyGovnModuleTypeImportDirective,
      ],
      "medigyGovn.instiProfile.lf.InstitutionProfileLhcForm",
      {
        instanceName: "profile",
        emittedFileExtn: ".lhc-form.auto.ts",
        govnDataImportURL: options.govnDataModuleRef,
      },
    ));
  }
}
