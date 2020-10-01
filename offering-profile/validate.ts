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

// validate the company name to which the offering belongs
export async function validateCompanyName(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) { //expecting ctx.form.items[].value with actual value
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

// validate the company email address to which the offering belongs
export async function validateCompanyEmail(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
    //email vaildations
    //Valid email format, Verify using https://email-checker.net/
  }
  return vlf.lformValidationSuccess;
}

// validate the company contact number to which the offering belongs
export async function validateCompanyContact(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

// validate the vendor name of the offering
export async function validateVendorName(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

// validate the vendor email address of the offering
export async function validateVendorEmail(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
    //Valid email format, Verify using https://email-checker.net/
  }
  return vlf.lformValidationSuccess;
}

// validate the offering name
export async function validateOfferingName(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

// validate the offering type
export async function validateOfferingType(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

// validate the offering website
export async function validateOfferingWebsite(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
    //Valid URL format, Verify using https://email-checker.net/
  }
  return vlf.lformValidationSuccess;
}

// validate the offering Topics
export async function validateOfferingTopics(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

// validate the offering description
export async function validateOfferingDescription(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  //Validation Rules:Maximum 45 to 50 words without any spelling/grammar error
  return vlf.lformValidationSuccess;
}

// validate the offering description
export async function validateOfferingOneLiner(
  ctx: vlf.LhcFormValidationContext,
): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  //Length of short description can be kept at 10 to 15 words
  return vlf.lformValidationSuccess;
}

export class OfferingProfileValidator extends vlf.LhcFormValidationSupplier {
  static readonly validators: vlf.LhcFormValidator[] = [
    validateName,
    validateEmail,
    validateCompanyName,
    validateCompanyEmail,
    validateCompanyContact,
    validateVendorName,
    validateVendorEmail,
    validateOfferingName,
    validateOfferingType,
    validateOfferingWebsite,
    validateOfferingTopics,
    validateOfferingDescription,
    validateOfferingOneLiner,
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
