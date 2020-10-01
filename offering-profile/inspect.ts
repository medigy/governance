import * as inspLF from "../inspect-lhc-form.ts";
import type * as insp from "../inspect.ts";

export async function validateName(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

export async function validateEmail(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the company name to which the offering belongs
export async function validateCompanyName(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (ctx.form.items) {
    for (let index = 0; index < ctx.form.items?.length; index++) {
      const element = ctx.form.items[index];
      if (element.items) {
        for (let index = 0; index < element.items?.length; index++) {
          const childElement = element.items[index];
          if (childElement.questionCode == "company-name") {
            inspLF.lformIssue("Please provide a valid company name");
          }
        }
      }
    }
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the company email address to which the offering belongs
export async function validateCompanyEmail(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (ctx.form.items) {
    for (let index = 0; index < ctx.form.items?.length; index++) {
      const element = ctx.form.items[index];
      if (element.items) {
        for (let index = 0; index < element.items?.length; index++) {
          const childElement = element.items[index];
          if (childElement.questionCode == "Q002-05") {
            inspLF.lformIssue("Please provide a valid company email");
          }
        }
      }
    }
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the company contact number to which the offering belongs
export async function validateCompanyContact(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (ctx.form.items) {
    for (let index = 0; index < ctx.form.items?.length; index++) {
      const element = ctx.form.items[index];
      if (element.items) {
        for (let index = 0; index < element.items?.length; index++) {
          const childElement = element.items[index];
          if (childElement.questionCode == "Q002-06") {
            inspLF.lformIssue("Please provide a valid company contact");
          }
        }
      }
    }
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the vendor name of the offering
export async function validateVendorName(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the vendor email address of the offering
export async function validateVendorEmail(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the offering name
export async function validateOfferingName(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the offering type
export async function validateOfferingType(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the offering website
export async function validateOfferingWebsite(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the offering categories
export async function validateOfferingCategories(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

// validate the offering description
export async function validateOfferingDescription(
  ctx: inspLF.LhcFormInspectionContext,
): Promise<inspLF.SuccessfulLhcFormInspection | inspLF.LhcFormInspectionIssue> {
  if (!ctx.form.name) {
    inspLF.lformIssue("Give error messages");
  }
  return inspLF.lformInspectionSuccess(ctx.form);
}

export class OfferingProfileValidator extends inspLF.LhcFormInspectionSupplier {
  static readonly validators: inspLF.LhcFormInspector[] = [
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
    validateOfferingCategories,
    validateOfferingDescription,
  ];
  static readonly singleton = new OfferingProfileValidator();

  async inspect(
    ctx: inspLF.LhcFormInspectionContext,
    ...validators: inspLF.LhcFormInspector[]
  ): Promise<insp.InspectionResult> {
    return super.inspect(
      ctx,
      ...validators,
      ...OfferingProfileValidator.validators,
    );
  }
}
