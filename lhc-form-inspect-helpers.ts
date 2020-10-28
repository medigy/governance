/**
 * This module contains LHC Form Inspection Helpers. They will be defined in
 * github.com/medigy/governance and tested here. Once they work, they will be
 * moved into github.com/shah/ts-lhncbc-lforms/item.ts or inspect.ts. This
 * allows us to treat the github.com/medigy/governance repo as a monorepo for 
 * convenience.
 */

import {
  inspect as insp,
  inspText,
  nihLhcForms as lf,
  safeHttpClient as shc,
  safety,
} from "./deps.ts";

export interface LhcFormItemInspectionResult<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
> extends insp.InspectionResult<I> {
  form: F;
}

export function isLhcFormItemInspectionResult<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
>(
  o: unknown,
): o is LhcFormItemInspectionResult<F, I> {
  return safety.typeGuard<LhcFormItemInspectionResult<F, I>>(
    "inspectionTarget",
    "form",
  )(o);
}

// @Geo or @Alan this should be merged into lf.ValueElement like this:
// export type ValueElement = string | boolean | number | ConstrainedValue
export type ConstrainedValue = {
  text?: string;
  code?: string | number;
  other?: boolean | string;
  system?: string | null;
  label?: string | null;
  score?: string | number | null;
};

export function isConstrainedValue(
  value: lf.ValueElement | lf.ValueElement[],
): value is ConstrainedValue {
  switch (typeof value) {
    case "number":
    case "boolean":
    case "string":
      return false;
  }
  return true;
}

export function isConstrainedValues(
  value: lf.ValueElement | lf.ValueElement[],
): value is ConstrainedValue[] {
  if (Array.isArray(value)) {
    return value.find((v) => !isConstrainedValue(v)) ? false : true;
  }
  return false;
}

export function isNumericValue(
  value: lf.ValueElement | lf.ValueElement[],
): value is number {
  switch (typeof value) {
    case "number":
      return true;

    default:
      return false;
  }
}

export function isNumericValues(
  value: lf.ValueElement | lf.ValueElement[],
): value is number[] {
  if (Array.isArray(value)) {
    return value.find((v) => !isNumericValue(v)) ? false : true;
  }
  return false;
}

export function isBooleanValue(
  value: lf.ValueElement | lf.ValueElement[],
): value is boolean {
  switch (typeof value) {
    case "boolean":
      return true;

    default:
      return false;
  }
}

export function isBooleanValues(
  value: lf.ValueElement | lf.ValueElement[],
  testAll: boolean,
): value is boolean[] {
  if (Array.isArray(value)) {
    return value.find((v) => !isBooleanValue(v)) ? false : true;
  }
  return false;
}

export function isTextValue(
  value: lf.ValueElement | lf.ValueElement[],
): value is string {
  switch (typeof value) {
    case "string":
      return true;

    default:
      return false;
  }
}

export function isTextValues(
  value: lf.ValueElement | lf.ValueElement[],
  testAll: string,
): value is string[] {
  if (Array.isArray(value)) {
    return value.find((v) => !isTextValue(v)) ? false : true;
  }
  return false;
}

export function inspectRequiredFormItem<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
>(
  form: F,
  item: I,
): lf.LhcFormInspectionIssue | I {
  const value = item.value;
  const isArray = Array.isArray(value);
  // TODO -- @alan or @geo check all the ways fields can miss data
  if (!value) {
    /* Declared item.value to "" because value is undefined 
     * and an error comes in the truncate function(287th line) 
     * called in the coloredLhcFormIssueDiagnosticMessage() in inspect.ts file   
     */
    item.value = "";
    return lf.lchFormItemIssue(form, item, "Value required");
  } else if (value == "" || value == null) {
    return lf.lchFormItemIssue(form, item, "Value required");
  } else if (isConstrainedValues(value)) {
    //Is an array of constraints
    value.find((v) => {
      if (v.text == "" || v.code == "" || v.text == null || v.code == null) {
        return lf.lchFormItemIssue(form, item, "Value required");
      }
    });
  } else if (isConstrainedValue(value)) {
    if (
      value.text == "" || value.text == null || value.code == "" ||
      value.code == null
    ) {
      return lf.lchFormItemIssue(form, item, "Value required");
    }
  }

  return item;
}
/* Function for validating the Constrained List value 
 * against a predefined constrainedList Type Array 
 */
export function inspectConstrainedListItemArrayValue<
  V extends lf.ConstrainedListItemValue[],
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
>(
  o: I,
  match: lf.ConstrainedListItemValue[],
  form: F,
): lf.LhcFormInspectionIssue | I {
  const value = o.value;
  let checkValue: boolean = false;
  /* Need to validate against the given array of constrainedList
   * and return validation message if the value does not match any of the 
   * constrainedList object
   */
  if (value && !Array.isArray(value) && typeof value === "object") {
    match.find((v) => {
      if (v.text == value.text && v.code == value.code) {
        checkValue = true;
      }
    });
  } else if (value && Array.isArray(value) && typeof value === "object") {
    value.find((x) => {
      if (typeof x === "object") {
        match.find((v) => {
          if (v.text == x.text && v.code == x.code) {
            checkValue = true;
          }
        });
      }
    });
  }
  if (checkValue == false) {
    /* Declared o.value to "" because value is undefined 
     * and an error comes in the truncate function(287th line) 
     * called in the coloredLhcFormIssueDiagnosticMessage() in inspect.ts file   
     */
    o.value = "";
    //return validation error
    return lf.lchFormItemIssue(form, o, "Invalid value selected");
  }
  return o;
}

export function isConstrainedListItemSingleValue<
  V extends lf.ConstrainedListItemValue,
>(
  o: lf.FormItem,
  match: lf.ConstrainedListItemValue,
): match is V {
  const value = o.value;
  if (value && !Array.isArray(value) && typeof value === "object") {
    return match.code == value.code;
  }
  return false;
}

export function isConstrainedListItemNotSingleValue<
  V extends lf.ConstrainedListItemValue,
>(
  o: lf.FormItem,
  match: lf.ConstrainedListItemValue,
): match is V {
  return !isConstrainedListItemSingleValue<V>(o, match);
}

export const inspectOptionalFacebookURL = inspText.websiteUrlInspector({
  urlPattern: inspText.urlFormatInspector({ domainPattern: "facebook.com" }),
});

export const inspectRequiredFacebookURL = inspText.websiteUrlInspector({
  required: (
    target: inspText.TextValue | inspText.TextInspectionResult,
  ): inspText.TextInspectionIssue => {
    return insp.inspectionIssue(target, "Facebook URL Is required");
  },
  urlPattern: inspText.urlFormatInspector({ domainPattern: "facebook.com" }),
});

export const inspectOptionalTwitterURL = inspText.websiteUrlInspector({
  urlPattern: inspText.urlFormatInspector({ domainPattern: "twitter.com" }),
});

export const inspectRequiredTwitterURL = inspText.websiteUrlInspector({
  required: (
    target: inspText.TextValue | inspText.TextInspectionResult,
  ): inspText.TextInspectionIssue => {
    return insp.inspectionIssue(target, "Twitter URL Is required");
  },
  urlPattern: inspText.urlFormatInspector({ domainPattern: "twitter.com" }),
});

export const inspectOptionalLinkedInURL = inspText.websiteUrlInspector({
  urlPattern: inspText.urlFormatInspector({ domainPattern: "linkedin.com" }),
});

export const inspectRequiredLinkedInURL = inspText.websiteUrlInspector({
  required: (
    target: inspText.TextValue | inspText.TextInspectionResult,
  ): inspText.TextInspectionIssue => {
    return insp.inspectionIssue(target, "LinkedIn URL Is required");
  },
  urlPattern: inspText.urlFormatInspector({ domainPattern: "linkedin.com" }),
});

export const inspectOptionalInstagramURL = inspText.websiteUrlInspector({
  urlPattern: inspText.urlFormatInspector({ domainPattern: "instagram.com" }),
});

export const inspectRequiredInstagramURL = inspText.websiteUrlInspector({
  required: (
    target: inspText.TextValue | inspText.TextInspectionResult,
  ): inspText.TextInspectionIssue => {
    return insp.inspectionIssue(target, "Instagram URL Is required");
  },
  urlPattern: inspText.urlFormatInspector({ domainPattern: "instagram.com" }),
});

export async function inspectEmailAddress(
  target: inspText.TextValue | inspText.TextInspectionResult,
): Promise<
  | inspText.TextValue
  | inspText.TextInspectionResult
  | inspText.TextInspectionIssue
> {
  const it: inspText.TextValue = inspText.isTextInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const email = inspText.resolveTextValue(it);
  if (!email || email.length == 0) {
    return it;
  }
  /* Check if the email is valid using 
   * tools like https://email-checker.net 
   */
  try {
    /* Check if email exists */
  } catch (err) {
    return inspText.textIssue(
      it,
      `Exception while trying to verify ${email}: ${err}`,
    );
  }

  // no errors found, return untouched
  return target;
}

export async function inspectPhoneNumberUSFormat(
  target: inspText.TextValue | inspText.TextInspectionResult,
): Promise<
  | inspText.TextValue
  | inspText.TextInspectionResult
  | inspText.TextInspectionIssue
> {
  const it: inspText.TextValue = inspText.isTextInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const phoneNumber = inspText.resolveTextValue(it);
  if (!phoneNumber || phoneNumber.length == 0) {
    return it;
  }
  /* Check if the phone number formatting is US */
  try {
    /* Check if phone number exists */
  } catch (err) {
    return inspText.textIssue(
      it,
      `Exception while trying to verify ${phoneNumber}: ${err}`,
    );
  }

  // no errors found, return untouched
  return target;
}

export type MedigyOntologyOWLResultTexts = MedigyOntologyOWLResultText[];
export type MedigyOntologyOWLResultText = string[];
export type MedigyOntologyOWLResultCode = string[];
export type MedigyOntologyOWLResultCount = number;
export interface MedigyOntologyOWLResult {
  readonly [index: number]:
    | MedigyOntologyOWLResultCount
    | MedigyOntologyOWLResultCode
    | null
    | MedigyOntologyOWLResultTexts;
}

export type MedigyOntologyOWLResults = MedigyOntologyOWLResult[];
export interface externalResult {
  text: string;
  code: string;
}

export async function getConstrainedListFromMedigyOntologyOWL(
  url:
    | "https://proxy.ontology.attest.cloud/api/v1/license/search"
    | "https://proxy.ontology.attest.cloud/api/v1/sourceofinvitation/search"
    | "https://proxy.ontology.attest.cloud/api/v1/collection/search",
): Promise<lf.ConstrainedListItemValue[]> {
  const medigyOntologyOWLRes = await shc.safeFetchJSON<
    MedigyOntologyOWLResults
  >(
    {
      request: url,
    },
    shc.jsonContentInspector(),
  );
  // transform
  const medigyOntologyOWLResultText = medigyOntologyOWLRes?.find((v) => {
    if (v != null) {
      if (isMedigyOntologyOWLResultText(v)) {
        return v;
      }
    }
  });
  const medigyOntologyOWLResultCount = medigyOntologyOWLRes?.find((v) => {
    if (isNumericValue(v)) {
      return v;
    }
  });

  const medigyOntologyOWLResultCode = medigyOntologyOWLRes?.find((v) => {
    if (isMedigyOntologyOWLResultCode(v)) {
      return v;
    }
  });
  const resultant: {
    code: number | MedigyOntologyOWLResultCode | MedigyOntologyOWLResultTexts;
    text: string;
  }[] = [];
  if (
    typeof medigyOntologyOWLResultText === "object" &&
    typeof medigyOntologyOWLResultCode === "object" &&
    typeof medigyOntologyOWLResultCount === "number"
  ) {
    for (let index = 0; index < medigyOntologyOWLResultCount; index++) {
      const text = medigyOntologyOWLResultText[index]?.toLocaleString();
      const textCode = medigyOntologyOWLResultCode[index];
      if (text && textCode) {
        //
        resultant[index] = {
          "code": textCode,
          "text": text,
        };
      }
    }
  }
  return resultant as lf.ConstrainedListItemValue[];
}

export function isMedigyOntologyOWLResultCode(
  value: MedigyOntologyOWLResult,
): value is MedigyOntologyOWLResultCode[] {
  switch (typeof value) {
    case "object":
      return true;

    default:
      return false;
  }
}

export function isMedigyOntologyOWLResultText(
  value: MedigyOntologyOWLResult,
): value is MedigyOntologyOWLResultTexts {
  switch (typeof value[0]) {
    case "object":
      return true;

    default:
      return false;
  }
}
