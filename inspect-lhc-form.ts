// TODO: move this module into github.com/shah/ts-lhncbc-lforms

import type { nihLhcForms as lforms } from "./deps.ts";
import * as insp from "./inspect.ts";
import type * as tr from "./transform.ts";

export interface SuccessfulLhcFormInspection<
  F extends lforms.NihLhcForm = lforms.NihLhcForm,
> extends insp.SuccessfulInspection {
  isSuccessfulLhcFormInspection: true;
  form: F;
}

export interface LhcFormInspectionIssue
  extends insp.InspectionIssue, insp.DiagnosableInspectionResult {
  isLhcFormInspectionIssue: true;
}

export interface LhcFormItemInspectionIssue<
  I extends lforms.FormItem = lforms.FormItem,
> extends insp.InspectionIssue, insp.DiagnosableInspectionResult {
  isLhcFormItemInspectionIssue: true;
  item: I;
}

export function lformInspectionSuccess<
  F extends lforms.NihLhcForm = lforms.NihLhcForm,
>(
  form: F,
): SuccessfulLhcFormInspection {
  return {
    isInspectionResult: true,
    isSuccessfulInspection: true,
    isSuccessfulLhcFormInspection: true,
    form: form,
  };
}

export function lformIssue(
  message: string,
): LhcFormInspectionIssue {
  return {
    isInspectionResult: true,
    isInspectionIssue: true,
    isLhcFormInspectionIssue: true,
    diagnosticMessage: (): string => {
      return message;
    },
  };
}

export function lformItemIssue<
  I extends lforms.FormItem = lforms.FormItem,
>(
  message: string,
  item: I,
): LhcFormItemInspectionIssue {
  return {
    isInspectionResult: true,
    isInspectionIssue: true,
    isLhcFormItemInspectionIssue: true,
    item: item,
    diagnosticMessage: (): string => {
      return message;
    },
  };
}

export class LhcFormInspectionContext<
  F extends lforms.NihLhcForm = lforms.NihLhcForm,
> implements insp.InspectionContext<F> {
  readonly form: F;

  constructor(
    form: F,
    sanitize?: tr.TransformerSync<tr.TransformerContext, F>,
  ) {
    this.form = sanitize ? sanitize.transform(form) : form;
  }

  content(): F {
    return this.form;
  }
}

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionDiagnostics<
  F extends lforms.NihLhcForm = lforms.NihLhcForm,
> extends
  insp.InspectionDiagnostics<
    F,
    LhcFormInspectionContext<F>
  > {
}

export interface LhcFormInspector<
  F extends lforms.NihLhcForm = lforms.NihLhcForm,
> extends insp.Inspector<F, LhcFormInspectionContext<F>> {
  (
    ctx: LhcFormInspectionContext<F>,
    diags: LhcFormInspectionDiagnostics<F>,
  ): Promise<insp.InspectionResult>;
}

export class LhcFormInspectionSupplier<
  F extends lforms.NihLhcForm = lforms.NihLhcForm,
> extends insp.TypicalInspectionSupplier<
  F,
  LhcFormInspectionContext<F>
> {
}

export class LhcFormAccessor<F extends lforms.NihLhcForm> {
  constructor(readonly form: F) {
  }
}

export class LhcFormItemAccessor<I extends lforms.FormItem> {
  constructor(readonly item: I) {
  }
}
