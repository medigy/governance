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
## Custom Validation Rules for Offering Profiles 

### Email address 
```typescript
interface EmailAddressItem
```
Question Codes  Q002-05 & Q002-08 

* Email should be a valid Email and need to verify tools like    [https://email-checker.net](https://email-checker.net)

### Contact number 

```typescript
interface PhoneItem
```
Question Codes  Q002-06 & Q002-09

* Contact number of the company
* US number formatting
* Validate with reference source site if possible

### A one liner describing the offering

```typescript
interface OfferingOneLinerDescription
```
Question Codes  Q005-11

* Short description of the offering- Use 10 to 15 words.

### Describe the key benefits and unique value proposition of the offering

```typescript
interface OfferingDescription
```
Question Codes  Q005-07

* Short description of the offering- Use 10 to 15 words.

### Website of the offering

```typescript
interface OfferingWebsite
```
Question Codes  Q005-03

* URL of the offering, where information related to this offering is mentioned
* Validate with reference source site

### License Of The Offering

```typescript
interface OfferingLicense
```
Question Codes  Q005-22

* Choose 'Opensource type/ Commercial/ None of the above' from the list
* Validate with reference source site

### GIT repository link of the offering

```typescript
interface OfferingGitRepository
```
Question Codes  Q005-06

* Mandatory if "License Of The Offering" is Open Source
* GIT URL of the offering repository
* Validate with reference source site

### Permalink

```typescript
interface OfferingGitRepository
```
Question Codes  Q005-06


* Unique link in the entire system of offering

### Facebook page of the offering

```typescript
interface SocialPresenceFacebookLink
```
Question Codes  Q006-01

* Facebook URL, to be verified in Facebook
* Validate with reference source site
#### Twitter page of the offering

```typescript
interface SocialPresenceTwitterLink
```
Question Codes  Q006-02

* Twitter URL to be verified in Twitter
* Validate with reference source site
### LinkedIn page of the offering

```typescript
interface SocialPresenceLinkedInLink
```
Question Codes  Q006-03

* LinkedIn URL to be verified in LinkedIn
* Validate with reference source site
### Instagram page of the offering

```typescript
interface SocialPresenceInstagramLink
```
Question Codes  Q006-04

* Instagram URL to be verified in Instagram
* Validate with reference source site

## Custom Validation Rules for Institution Profiles 

### Website

```typescript
interface Website
```
Question Codes  Q002-02-01

* URL of the institution, where information related to this 
* Validate with reference source site

### Work Email  

```typescript
interface EmailAddressItem
```
Question Codes  Q002-02-02

* URL of the institution, where information related to this 
* Validate with reference source site

### Work Phone & Another Phone

```typescript
interface PhoneItem
```
Question Codes  Q002-02-03 & Q002-02-02-04 

* URL of the institution, where information related to this 
* Validate with reference source site
