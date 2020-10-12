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
    previous?: InspectionResult,
  ): Promise<InspectionResult>;
}

export interface InspectionSupplier<T, C extends InspectionContext<T>> {
  readonly inspect: (
    ctx: C,
    diags: InspectionDiagnostics<T, C>,
    ...inspectors: Inspector<T, C>[]
  ) => Promise<InspectionResult>;
}

export class InspectionDiagnosticsRecorder<T, C extends InspectionContext<T>>
  implements InspectionDiagnostics<T, C> {
  readonly issues: InspectionIssue[] = [];
  readonly exceptions: InspectionException[] = [];

  continue(ctx: C, result: InspectionResult): boolean {
    if (isInspectionIssueRecoverable(result)) return true;

    // stop after the first unrecoverable error
    return isSuccessfulInspection(result);
  }

  async onIssue(
    result: InspectionResult,
    ctx: C,
  ): Promise<InspectionResult> {
    const issue: InspectionIssue = {
      // if the result is diagnosable, it will be part of the spread
      ...result,
      isInspectionIssue: true,
    };
    this.issues.push(issue);
    return issue;
  }

  async onException(
    err: Error,
    result: InspectionResult,
    ctx: C,
  ): Promise<InspectionResult> {
    const exception: InspectionException = {
      ...result,
      isInspectionIssue: true,
      isInspectionException: true,
      exception: err,
    };
    this.exceptions.push(exception);
    return exception;
  }
}

export class ConsoleInspectionDiagnostics<T, C extends InspectionContext<T>>
  implements InspectionDiagnostics<T, C> {
  constructor(
    readonly wrap: InspectionDiagnostics<T, C>,
    readonly verbose?: boolean,
  ) {
  }

  continue(ctx: C, result: InspectionResult): boolean {
    return this.wrap.continue(ctx, result);
  }

  async onIssue(
    result: InspectionResult,
    ctx: C,
  ): Promise<InspectionResult> {
    if (this.verbose && isDiagnosableInspectionResult(result)) {
      console.error(result.diagnosticMessage(result));
    }
    return await this.wrap.onIssue(result, ctx);
  }

  async onException(
    err: Error,
    result: InspectionResult,
    ctx: C,
  ): Promise<InspectionResult> {
    if (this.verbose) {
      if (isDiagnosableInspectionResult(result)) {
        console.error(result.diagnosticMessage(result));
      } else {
        console.error(err);
      }
    }
    return await this.wrap.onException(err, result, ctx);
  }
}

export function inspectionPipe<T, C extends InspectionContext<T>>(
  outerCtx: C,
  outerDiags: InspectionDiagnostics<T, C>,
  ...inspectors: Inspector<T, C>[]
): Inspector<T, C> {
  const outerResult: Inspector<T, C> = async (
    ctx: C = outerCtx,
    diags: InspectionDiagnostics<T, C> = outerDiags,
    outerPrevious?: InspectionResult,
  ): Promise<InspectionResult> => {
    if (inspectors.length == 0) {
      const empty: EmptyInspectorsResult<T> = {
        isInspectionResult: true,
        isSuccessfulInspection: true,
        isEmptyInspectors: true,
      };
      return empty;
    }

    let innerResult: InspectionResult = outerPrevious || {
      isInspectionResult: true,
    };
    for (const inspect of inspectors) {
      try {
        innerResult = await inspect(ctx, diags, innerResult);
        if (isInspectionException(innerResult)) {
          innerResult = await diags.onException(
            innerResult.exception,
            innerResult,
            ctx,
          );
          if (!diags.continue(ctx, innerResult)) return innerResult;
        } else if (isInspectionIssue(innerResult)) {
          innerResult = await diags.onIssue(innerResult, ctx);
          if (!diags.continue(ctx, innerResult)) return innerResult;
        }
      } catch (innerErr) {
        innerResult = await diags.onException(innerErr, innerResult, ctx);
        if (!diags.continue(ctx, innerResult)) return innerResult;
      }
    }
    return innerResult;
  };
  return outerResult;
}

export class TypicalInspectionSupplier<T, C extends InspectionContext<T>>
  implements InspectionSupplier<T, C> {
  constructor() {
  }

  async inspect(
    ctx: C,
    diags: InspectionDiagnostics<T, C>,
    ...inspectors: Inspector<T, C>[]
  ): Promise<InspectionResult> {
    const v = inspectionPipe<T, C>(ctx, diags, ...inspectors);
    return await v(ctx, diags);
  }
}
