import type * as tr from "./transform.ts";
import * as vld from "./validate.ts";
import type { nihLhcForms as lforms } from "./deps.ts";

export interface LhcFormValidResult extends vld.SuccessfulValidation {
  isLhcFormValidResult: true;
}

export interface LhcFormInvalidResult
  extends vld.InvalidResult, vld.DiagnosableValidationResult {
  isLhcFormInvalidResult: true;
}

export const lformValidationSuccess: LhcFormValidResult = {
  isValidationResult: true,
  isSuccessfulValidation: true,
  isLhcFormValidResult: true,
};

export function lformInvalid(
  message: string,
): LhcFormInvalidResult {
  return {
    isValidationResult: true,
    isInvalidResult: true,
    isLhcFormInvalidResult: true,
    diagnosticMessage: (): string => {
      return message;
    },
  };
}

export class LhcFormValidationContext
  implements vld.ValidationContext<lforms.NihLhcForm> {
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
export interface LhcFormValidationDiagnostics extends
  vld.ValidationDiagnostics<
    lforms.NihLhcForm,
    LhcFormValidationContext
  > {
}

export interface LhcFormValidator
  extends vld.Validator<lforms.NihLhcForm, LhcFormValidationContext> {
  (
    ctx: LhcFormValidationContext,
    diags: LhcFormValidationDiagnostics,
  ): Promise<vld.ValidationResult>;
}

export class LhcFormValidationSupplier extends vld.TypicalValidationSupplier<
  lforms.NihLhcForm,
  LhcFormValidationContext
> {
}
