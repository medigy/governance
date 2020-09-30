export interface ValidationContext<T> {
  readonly content: () => T;
}

export interface ValidationResult {
  readonly isValidationResult: true;
}

export interface DiagnosableValidationResult {
  readonly diagnosticMessage: (vr?: ValidationResult) => string;
}

export function isDiagnosableValidationResult(
  o: unknown,
): o is DiagnosableValidationResult {
  return o && typeof o === "object" && "diagnosticMessage" in o;
}

export interface SuccessfulValidation extends ValidationResult {
  readonly isSuccessfulValidation: true;
}

export interface EmptyValidatorsResult extends SuccessfulValidation {
  readonly isEmptyValidators: true;
}

export function isValid(vr: ValidationResult): vr is SuccessfulValidation {
  return "isSuccessfulValidation" in vr;
}

export interface InvalidResult extends ValidationResult {
  readonly isInvalidResult: true;
}

export function isInvalidResult(vr: ValidationResult): vr is InvalidResult {
  return "isInvalidResult" in vr;
}

export interface RecoverableInvalidResult {
  readonly isInvalidResultRecoverable: boolean;
}

export function isInvalidResultRecoverable(
  o: unknown,
): o is RecoverableInvalidResult {
  return o && typeof o === "object" && "isInvalidResultRecoverable" in o;
}

export interface ExceptionResult extends InvalidResult {
  readonly isExceptionResult: true;
  readonly error: Error;
}

export function isExceptionResult(vr: ValidationResult): vr is ExceptionResult {
  return "isExceptionResult" in vr;
}

export interface InvalidContentDiagnostic {
  readonly message: string;
}

export interface ValidationDiagnostics<T, C extends ValidationContext<T>> {
  onInvalidContent: (
    result: ValidationResult,
    ctx: C,
  ) => Promise<ValidationResult>;
  onException: (
    err: Error,
    result: ValidationResult,
    ctx: C,
  ) => Promise<ValidationResult>;
  continue: (ctx: C, result: ValidationResult) => boolean;
}

export interface Validator<T, C extends ValidationContext<T>> {
  (
    ctx: C,
    diags: ValidationDiagnostics<T, C>,
  ): Promise<ValidationResult>;
}

export interface ValidationSupplier<T, C extends ValidationContext<T>> {
  readonly validate: (
    ctx: C,
    ...validators: Validator<T, C>[]
  ) => Promise<ValidationResult>;
}

export function defaultValidationDiags<T, C extends ValidationContext<T>>(
  options?: Partial<ValidationDiagnostics<T, C>> & {
    verbose?: boolean;
  },
): ValidationDiagnostics<T, C> {
  const verbose = typeof options?.verbose === "undefined"
    ? true
    : options.verbose;
  return {
    continue: (ctx: C, result: ValidationResult): boolean => {
      if (isInvalidResultRecoverable(result)) return true;

      // stop after the first unrecoverable error
      return isValid(result);
    },
    onInvalidContent: options?.onInvalidContent ||
      (async (
        result: ValidationResult,
        ctx: C,
      ): Promise<InvalidResult> => {
        if (verbose && isDiagnosableValidationResult(result)) {
          console.error(result.diagnosticMessage(result));
        }
        return {
          // if the result is dianosable, it will be part of the spread
          ...result,
          isInvalidResult: true,
        };
      }),
    onException: options?.onException ||
      (async (
        err: Error,
        result: ValidationResult,
      ): Promise<ExceptionResult> => {
        if (verbose) {
          if (isDiagnosableValidationResult(result)) {
            console.error(result.diagnosticMessage(result));
          } else {
            console.error(err);
          }
        }
        return {
          ...result,
          isInvalidResult: true,
          isExceptionResult: true,
          error: err,
        };
      }),
  };
}

export function validationPipe<T, C extends ValidationContext<T>>(
  outerCtx: C,
  outerDiags: ValidationDiagnostics<T, C>,
  ...validators: Validator<T, C>[]
): Validator<T, C> {
  const result: Validator<T, C> = async (
    ctx: C = outerCtx,
    diags: ValidationDiagnostics<T, C> = outerDiags,
  ): Promise<ValidationResult> => {
    if (validators.length == 0) {
      const empty: EmptyValidatorsResult = {
        isValidationResult: true,
        isSuccessfulValidation: true,
        isEmptyValidators: true,
      };
      return empty;
    }

    let result: ValidationResult = {
      isValidationResult: true,
    };
    for (const validate of validators) {
      try {
        result = await validate(ctx, diags);
        if (isExceptionResult(result)) {
          result = await diags.onInvalidContent(result, ctx);
          if (!diags.continue(ctx, result)) return result;
        }
      } catch (innerErr) {
        // if we get an exception in an inner validator, allow continuation
        result = await diags.onException(innerErr, result, ctx);
        if (!diags.continue(ctx, result)) return result;
      }
    }
    return result;
  };
  return result;
}

export class TypicalValidationSupplier<T, C extends ValidationContext<T>>
  implements ValidationSupplier<T, C> {
  constructor(readonly diags = defaultValidationDiags<T, C>()) {
  }

  async validate(
    ctx: C,
    ...validators: Validator<T, C>[]
  ): Promise<ValidationResult> {
    const v = validationPipe<T, C>(ctx, this.diags, ...validators);
    return await v(ctx, this.diags);
  }
}
