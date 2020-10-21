/**
 * This module contains LHC Form Inspection Helpers. They will be defined in
 * github.com/medigy/governance and tested here. Once they work, they will be
 * moved into github.com/shah/ts-lhncbc-lforms/item.ts or inspect.ts. This
 * allows us to treat the github.com/medigy/governance repo as a monorepo for 
 * convenience.
 */

import { inspect as insp, nihLhcForms as lf, safety } from "./deps.ts";

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
): value is number {
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
  testAll: boolean,
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
    console.log("Is an array of constraints");
  } else if (isConstrainedValue(value)) {
    console.log(value.text);
    console.log(value.code);
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
