import * as tr from "../transform.ts";
import type * as vld from "../validate.ts";
import * as vlf from "../validate-lhc-form.ts";

export async function validateName(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

export async function validateEmail(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

export class OfferingProfileValidator extends vlf.LhcFormValidationSupplier {
  static readonly validators: vlf.LhcFormValidator[] = [
    validateName,
    validateEmail,
  ];
  static readonly singleton = new OfferingProfileValidator();

  async validate(
    ctx: vlf.LhcFormValidationContext,
    ...validators: vlf.LhcFormValidator[]
  ): Promise<vld.ValidationResult> {
    return super.validate(
      ctx,
      ...validators,
      ...OfferingProfileValidator.validators,
    );
  }
}
