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

export interface CompanyProfile extends lf.ConstrainedListItem {
  readonly questionCode: "002-01-01";
  readonly localQuestionCode: "002-01-01";
  readonly question: "You are*";
}

export interface JobTitle extends lf.ExtensibleConstrainedListItem {
  readonly questionCode: "002-01-02";
  readonly localQuestionCode: "002-01-02";
  readonly question: "Your Job Title*";
}

export interface CompanyName extends RequiredUniqueTextItem {
  readonly questionCode: "002-01-04";
  readonly localQuestionCode: "002-01-04";
  readonly question: "Company Name*";
}

export interface CompanyDescription extends UniqueMultiLineTextItem {
  readonly questionCode: "002-01-11";
  readonly question: "Company Description";
}

export interface DateofIncorporation extends UniqueDateItem {
  readonly questionCode: "002-01-05";
  readonly localQuestionCode: "002-01-05";
  readonly question: "Date of Incorporation*";
}
export interface CompanyType extends lf.ConstrainedListItem {
  readonly questionCode: "002-01-06";
  readonly localQuestionCode: "002-01-06";
  readonly question: "Company Type*";
}
export interface RegistrationNumber extends RequiredUniqueTextItem {
  readonly questionCode: "002-01-07";
  readonly question: "Registration Number*";
}
export interface Industry extends RequiredUniqueTextItem {
  readonly questionCode: "002-01-08";
  readonly localQuestionCode: "002-01-08";
  readonly question: "Industry";
}
export interface Currency extends RequiredUniqueTextItem {
  readonly questionCode: "002-01-09";
  readonly localQuestionCode: "002-01-09";
  readonly question: "Currency";
}
export interface NetWorth extends RequiredUniqueTextItem {
  readonly questionCode: "002-01-10";
  readonly localQuestionCode: "002-01-10";
  readonly question: "Net Worth";
}
export interface CompanySize extends lf.ExtensibleConstrainedListItem {
  readonly questionCode: "002-01-12";
  readonly localQuestionCode: "002-01-12";
  readonly question: "Company Size*";
}

export interface Website extends RequiredUniqueTextItem {
  readonly questionCode: "002-02-01";
  readonly localQuestionCode: "002-02-01";
  readonly question: "Website*";
}
export interface WorkEmail extends lf.UniqueEmailAddressItem {
  readonly questionCode: "002-02-02";
  readonly localQuestionCode: "002-02-02";
  readonly question: "Work Email*";
}
export interface WorkPhone extends lf.UniquePhoneItem {
  readonly questionCode: "002-02-03";
  readonly localQuestionCode: "002-02-03";
  readonly question: "Work Phone*";
}
export interface AlternatePhone extends lf.UniquePhoneItem {
  readonly questionCode: "002-02-04";
  readonly localQuestionCode: "002-02-04";
  readonly question: "Another Phone";
}

export interface InvitationSource extends lf.ConstrainedListItem {
  readonly questionCode: "Q002-02-11";
  readonly localQuestionCode: "Q002-02-11";
  readonly question: "Source of Invitation";
}
export interface CrmIdentifier extends RequiredUniqueTextItem {
  readonly questionCode: "002-02-12";
  readonly localQuestionCode: "002-02-12";
  readonly question: "CRM Identifier";
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
export interface GithubUserName extends RequiredUniqueTextItem {
  readonly questionCode: "002-03-01";
  readonly localQuestionCode: "002-03-01";
  readonly question: "Github UserName";
}
export interface GithubPassword extends RequiredUniqueTextItem {
  readonly questionCode: "002-03-02";
  readonly localQuestionCode: "002-03-02";
  readonly question: "Github Password";
}
export interface GithubClientId extends RequiredUniqueTextItem {
  readonly questionCode: "002-03-03";
  readonly localQuestionCode: "002-03-03";
  readonly question: "Github Client ID";
}
export interface GithubClientSecret extends RequiredUniqueTextItem {
  readonly questionCode: "002-03-04";
  readonly localQuestionCode: "002-03-04";
  readonly question: "Github Client Secret";
}
export interface GithubOwner extends RequiredUniqueTextItem {
  readonly questionCode: "002-03-05";
  readonly localQuestionCode: "002-03-05";
  readonly question: "Github Owner";
}
export interface GithubRepo extends RequiredUniqueTextItem {
  readonly questionCode: "002-03-06";
  readonly localQuestionCode: "002-03-06";
  readonly question: "Github Repo";
}

export interface CompanyAddress extends lf.FormItem {
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

export interface HouseOrBuilding extends RequiredUniqueTextItem {
  readonly questionCode: "002-02-06";
  readonly localQuestionCode: "002-02-06";
  readonly question: "House/Building*";
}

export interface TownOrCity extends RequiredUniqueTextItem {
  readonly questionCode: "002-02-07";
  readonly localQuestionCode: "002-02-07";
  readonly question: "Town/City*";
}
export interface StateOrProvince extends RequiredUniqueTextItem {
  readonly questionCode: "002-02-08";
  readonly localQuestionCode: "002-02-08";
  readonly question: "State/Province*";
}
export interface ZipOrPostal extends RequiredUniqueTextItem {
  readonly questionCode: "002-02-09";
  readonly localQuestionCode: "002-02-09";
  readonly question: "ZIP/Postal Code*";
}
export interface CountryOrRegion extends RequiredUniqueTextItem {
  readonly questionCode: "002-02-10";
  readonly localQuestionCode: "002-02-10";
  readonly question: "Country/Region*";
}

export interface ContactDetails extends lf.FormItem {
  readonly header: true;
  readonly question: "Contact Details";
  readonly questionCode: "002-02-00";
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
