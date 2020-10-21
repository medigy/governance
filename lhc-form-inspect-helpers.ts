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

export async function inspectFacebookURL(
  target: inspText.TextValue | inspText.TextInspectionResult,
): Promise<
  | inspText.TextValue
  | inspText.TextInspectionResult
  | inspText.TextInspectionIssue
> {
  const it: inspText.TextValue = inspText.isTextInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const url = inspText.resolveTextValue(it);
  if (!url || url.length == 0) {
    return it;
  }
  const siteCollectionDetector = "facebook.com/";
  if (url.indexOf(siteCollectionDetector) >= 0) {
    return inspText.textIssue(
      it,
      `${url} is not a valid facebook url`,
    );
  }
  try {
    const urlFetch = await fetch(url);
    if (urlFetch.status != 200) {
      return inspText.textIssue(
        it,
        `${url} did not return valid status: ${urlFetch.statusText}`,
      );
    }
  } catch (err) {
    return inspText.textIssue(
      it,
      `Exception while trying to fetch ${url}: ${err}`,
    );
  }

  // no errors found, return untouched
  return target;
}

export async function inspectTwitterURL(
  target: inspText.TextValue | inspText.TextInspectionResult,
): Promise<
  | inspText.TextValue
  | inspText.TextInspectionResult
  | inspText.TextInspectionIssue
> {
  const it: inspText.TextValue = inspText.isTextInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const url = inspText.resolveTextValue(it);
  if (!url || url.length == 0) {
    return it;
  }
  const siteCollectionDetector = "twitter.com/";
  if (url.indexOf(siteCollectionDetector) >= 0) {
    return inspText.textIssue(
      it,
      `${url} is not a valid twitter url`,
    );
  }
  try {
    const urlFetch = await fetch(url);
    if (urlFetch.status != 200) {
      return inspText.textIssue(
        it,
        `${url} did not return valid status: ${urlFetch.statusText}`,
      );
    }
  } catch (err) {
    return inspText.textIssue(
      it,
      `Exception while trying to fetch ${url}: ${err}`,
    );
  }

  // no errors found, return untouched
  return target;
}

export async function inspectLinkedInURL(
  target: inspText.TextValue | inspText.TextInspectionResult,
): Promise<
  | inspText.TextValue
  | inspText.TextInspectionResult
  | inspText.TextInspectionIssue
> {
  const it: inspText.TextValue = inspText.isTextInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const url = inspText.resolveTextValue(it);
  if (!url || url.length == 0) {
    return it;
  }
  const siteCollectionDetector = "linkedin.com/";
  if (url.indexOf(siteCollectionDetector) >= 0) {
    return inspText.textIssue(
      it,
      `${url} is not a valid linkedin url`,
    );
  }
  try {
    const urlFetch = await fetch(url);
    if (urlFetch.status != 200) {
      return inspText.textIssue(
        it,
        `${url} did not return valid status: ${urlFetch.statusText}`,
      );
    }
  } catch (err) {
    return inspText.textIssue(
      it,
      `Exception while trying to fetch ${url}: ${err}`,
    );
  }

  // no errors found, return untouched
  return target;
}

export async function inspectInstagramURL(
  target: inspText.TextValue | inspText.TextInspectionResult,
): Promise<
  | inspText.TextValue
  | inspText.TextInspectionResult
  | inspText.TextInspectionIssue
> {
  const it: inspText.TextValue = inspText.isTextInspectionResult(target)
    ? target.inspectionTarget
    : target;
  const url = inspText.resolveTextValue(it);
  if (!url || url.length == 0) {
    return it;
  }
  const siteCollectionDetector = "instagram.com/";
  if (url.indexOf(siteCollectionDetector) >= 0) {
    return inspText.textIssue(
      it,
      `${url} is not a valid instagram url`,
    );
  }
  try {
    const urlFetch = await fetch(url);
    if (urlFetch.status != 200) {
      return inspText.textIssue(
        it,
        `${url} did not return valid status: ${urlFetch.statusText}`,
      );
    }
  } catch (err) {
    return inspText.textIssue(
      it,
      `Exception while trying to fetch ${url}: ${err}`,
    );
  }

  // no errors found, return untouched
  return target;
}

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
