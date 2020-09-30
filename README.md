# Medigy Governance

Artifacts to help define Medigy schemas and other information governance structures.

# Validation Infrastructure

* The core validation infrastructure resides in [validate.ts](validate.ts), which is fully generic.
* The common LHC Form validation code resides in [validate-lhc-form.ts](validate-lhc-form.ts), which creates LHC Form instances of the generic core validation infrastructure.
* Each of the different schemas, such as offering profiles, has their own validation rules:
  * See [offering-profile/validate.ts](offering-profile/validate.ts)
  * Most developers will only need to work with [offering-profile/validate.ts](offering-profile/validate.ts) and similar files (not the generic versions or even the common LHC Forms instances of the generic infrastructure).

## Maintaining validation rules

Each rule is an independent function:
* The name of the rule is the name of the function
* The parameter `ctx` is passed in and contains `ctx.form` which is an instance of an LHC Form that has been parsed and made available
* The job of the function is to implement a simple or complex rule and then return either a `LhcFormValidResult` or `LhcFormInvalidResult` instance


For example:

```typescript
export async function ruleName1(ctx: vlf.LhcFormValidationContext): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  // rule 1
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}

export async function ruleName2(ctx: vlf.LhcFormValidationContext): Promise<vlf.LhcFormValidResult | vlf.LhcFormInvalidResult> {
  // rule 2
  if (!ctx.form.name) {
    vlf.lformInvalid("Give error messages");
  }
  // rule 3
  if (...run another check...) {
    vlf.lformInvalid("Give error messages");
  }
  return vlf.lformValidationSuccess;
}
```
