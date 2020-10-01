// TODO: move this module into github.com/shah/ts-lhncbc-lforms

import type { nihLhcForms as lforms } from "./deps.ts";
import * as insp from "./inspect.ts";
import type * as tr from "./transform.ts";

export interface SuccessfulLhcFormInspection extends insp.SuccessfulInspection {
  isSuccessfulLhcFormInspection: true;
  form: lforms.NihLhcForm;
}

export interface LhcFormInspectionIssue
  extends insp.InspectionIssue, insp.DiagnosableInspectionResult {
  isLhcFormInspectionIssue: true;
}

export function lformInspectionSuccess(
  form: lforms.NihLhcForm,
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

export class LhcFormInspectionContext
  implements insp.InspectionContext<lforms.NihLhcForm> {
  readonly form: lforms.NihLhcForm;

  constructor(
    form: lforms.NihLhcForm,
    sanitize?: tr.TransformerSync<tr.TransformerContext, lforms.NihLhcForm>,
  ) {
    this.form = sanitize ? sanitize.transform(form) : form;
  }

  content(): lforms.NihLhcForm {
    return this.form;
  }
}

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionDiagnostics
  extends
    insp.InspectionDiagnostics<
      lforms.NihLhcForm,
      LhcFormInspectionContext
    > {
}

export interface LhcFormInspector
  extends insp.Inspector<lforms.NihLhcForm, LhcFormInspectionContext> {
  (
    ctx: LhcFormInspectionContext,
    diags: LhcFormInspectionDiagnostics,
  ): Promise<insp.InspectionResult>;
}

export class LhcFormInspectionSupplier extends insp.TypicalInspectionSupplier<
  lforms.NihLhcForm,
  LhcFormInspectionContext
> {
}
