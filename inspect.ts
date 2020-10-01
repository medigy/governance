// TODO: move this module into github.com/gov-suite/governed-structured-data

export interface InspectionContext<T> {
  readonly content: () => T;
}

export interface InspectionResult {
  readonly isInspectionResult: true;
}

export interface DiagnosableInspectionResult {
  readonly diagnosticMessage: (ir?: InspectionResult) => string;
}

export function isDiagnosableInspectionResult(
  o: unknown,
): o is DiagnosableInspectionResult {
  return o && typeof o === "object" && "diagnosticMessage" in o;
}

export interface SuccessfulInspection extends InspectionResult {
  readonly isSuccessfulInspection: true;
}

export interface EmptyInspectorsResult<T> extends SuccessfulInspection {
  readonly isEmptyInspectors: true;
}

export function isSuccessfulInspection(
  ir: InspectionResult,
): ir is SuccessfulInspection {
  return "isSuccessfulInspection" in ir;
}

export interface InspectionIssue extends InspectionResult {
  readonly isInspectionIssue: true;
}

export function isInspectionIssue(ir: InspectionResult): ir is InspectionIssue {
  return "isInspectionIssue" in ir;
}

export interface RecoverableInspectionIssue {
  readonly isRecoverableInspectionIssue: boolean;
}

export function isInspectionIssueRecoverable(
  o: unknown,
): o is RecoverableInspectionIssue {
  return o && typeof o === "object" && "isRecoverableInspectionIssue" in o;
}

export interface InspectionException extends InspectionIssue {
  readonly isInspectionException: true;
  readonly exception: Error;
}

export function isInspectionException(
  ir: InspectionResult,
): ir is InspectionException {
  return "isInspectionException" in ir;
}

export interface ContentIssueDiagnostic {
  readonly message: string;
}

export interface InspectionDiagnostics<T, C extends InspectionContext<T>> {
  onIssue: (
    result: InspectionResult,
    ctx: C,
  ) => Promise<InspectionResult>;
  onException: (
    err: Error,
    result: InspectionResult,
    ctx: C,
  ) => Promise<InspectionResult>;
  continue: (ctx: C, result: InspectionResult) => boolean;
}

export interface Inspector<T, C extends InspectionContext<T>> {
  (
    ctx: C,
    diags: InspectionDiagnostics<T, C>,
  ): Promise<InspectionResult>;
}

export interface InspectionSupplier<T, C extends InspectionContext<T>> {
  readonly inspect: (
    ctx: C,
    ...inspectors: Inspector<T, C>[]
  ) => Promise<InspectionResult>;
}

export function defaultInspectionDiags<T, C extends InspectionContext<T>>(
  options?: Partial<InspectionDiagnostics<T, C>> & {
    verbose?: boolean;
  },
): InspectionDiagnostics<T, C> {
  const verbose = typeof options?.verbose === "undefined"
    ? true
    : options.verbose;
  return {
    continue: (ctx: C, result: InspectionResult): boolean => {
      if (isInspectionIssueRecoverable(result)) return true;

      // stop after the first unrecoverable error
      return isSuccessfulInspection(result);
    },
    onIssue: options?.onIssue ||
      (async (
        result: InspectionResult,
        ctx: C,
      ): Promise<InspectionIssue> => {
        if (verbose && isDiagnosableInspectionResult(result)) {
          console.error(result.diagnosticMessage(result));
        }
        return {
          // if the result is dianosable, it will be part of the spread
          ...result,
          isInspectionIssue: true,
        };
      }),
    onException: options?.onException ||
      (async (
        err: Error,
        result: InspectionResult,
      ): Promise<InspectionException> => {
        if (verbose) {
          if (isDiagnosableInspectionResult(result)) {
            console.error(result.diagnosticMessage(result));
          } else {
            console.error(err);
          }
        }
        return {
          ...result,
          isInspectionIssue: true,
          isInspectionException: true,
          exception: err,
        };
      }),
  };
}

export function inspectionPipe<T, C extends InspectionContext<T>>(
  outerCtx: C,
  outerDiags: InspectionDiagnostics<T, C>,
  ...inspectors: Inspector<T, C>[]
): Inspector<T, C> {
  const result: Inspector<T, C> = async (
    ctx: C = outerCtx,
    diags: InspectionDiagnostics<T, C> = outerDiags,
  ): Promise<InspectionResult> => {
    if (inspectors.length == 0) {
      const empty: EmptyInspectorsResult<T> = {
        isInspectionResult: true,
        isSuccessfulInspection: true,
        isEmptyInspectors: true,
      };
      return empty;
    }

    let result: InspectionResult = {
      isInspectionResult: true,
    };
    for (const inspect of inspectors) {
      try {
        result = await inspect(ctx, diags);
        if (isInspectionException(result)) {
          result = await diags.onIssue(result, ctx);
          if (!diags.continue(ctx, result)) return result;
        }
      } catch (innerErr) {
        result = await diags.onException(innerErr, result, ctx);
        if (!diags.continue(ctx, result)) return result;
      }
    }
    return result;
  };
  return result;
}

export class TypicalInspectionSupplier<T, C extends InspectionContext<T>>
  implements InspectionSupplier<T, C> {
  constructor(readonly diags = defaultInspectionDiags<T, C>()) {
  }

  async inspect(
    ctx: C,
    ...inspectors: Inspector<T, C>[]
  ): Promise<InspectionResult> {
    const v = inspectionPipe<T, C>(ctx, this.diags, ...inspectors);
    return await v(ctx, this.diags);
  }
}
