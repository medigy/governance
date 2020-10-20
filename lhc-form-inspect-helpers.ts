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

export function inspectRequiredFormItem<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
>(
  form: F,
  item: I,
): lf.LhcFormInspectionIssue | I {
  // TODO -- @alan or @geo check all the ways fields can miss data
  if (!item.value) {
    return lf.lchFormItemIssue(form, item, "Value required");
  } else if (item.value == "" || item.value == null) {
    return lf.lchFormItemIssue(form, item, "Value required");
  } else if (typeof item.value === "object") {
    /* @shahid  Not able to access text or code from item value object
     * This may need to change in schema lhc form gsd schema lform.ts file
     */
    //item.value.text && item.value.code need to be validated
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
