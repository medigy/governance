import { safety } from "./deps.ts";
import * as insp from "./inspect.ts";
import type * as tr from "./transform.ts";

export const wordsInTextRegEx = /[^\s]+/g;

export interface InspectWordCountRangeContext extends TextInspectionContext {
  readonly minWords: number;
  readonly maxWords: number;
}

export const isInspectWordCountRangeContext = safety.typeGuardCustom<
  TextInspectionContext,
  InspectWordCountRangeContext
>("minWords", "maxWords");

export async function inspectWordCountRange(
  ctx: TextInspectionContext,
): Promise<
  insp.InspectionResult | SuccessfulTextInspection | TextInspectionIssue
> {
  const text = ctx.contentSupplier.text;
  if (!text || text.length == 0) {
    return ctx.contentSupplier.onNoTextAvailable
      ? ctx.contentSupplier.onNoTextAvailable()
      : textInspectionSuccess(ctx.contentSupplier);
  }
  const tw = words(ctx.contentSupplier);
  if (!tw) {
    return textIssue("Unable to count words");
  }
  let [min, max] = [10, 15];
  if (isInspectWordCountRangeContext(ctx)) {
    min = ctx.minWords;
    max = ctx.maxWords;
  }
  if (tw.wordCount > max || tw.wordCount < min) {
    return textIssue(
      `Word count should be between ${min}-${max} (not ${tw.wordCount})`,
    );
  }
  return textInspectionSuccess(ctx.contentSupplier);
}

export async function inspectWebsiteURL(
  ctx: TextInspectionContext,
): Promise<
  insp.InspectionResult | SuccessfulTextInspection | TextInspectionIssue
> {
  const url = ctx.contentSupplier.text;
  if (!url || url.length == 0) {
    return ctx.contentSupplier.onNoTextAvailable
      ? ctx.contentSupplier.onNoTextAvailable()
      : textInspectionSuccess(ctx.contentSupplier);
  }

  try {
    const urlFetch = await fetch(url);
    console.dir(urlFetch);
    if (urlFetch.status != 200) {
      return textIssue(
        `${url} did not return valid status: ${urlFetch.statusText}`,
      );
    }
  } catch (err) {
    return textIssue(
      `Exception while trying to fetch ${url}: ${err}`,
    );
  }

  return textInspectionSuccess(ctx.contentSupplier);
}

export interface TextWords {
  readonly words: string[];
  readonly wordCount: number;
}

export interface TextWordDistribution extends TextWords {
  readonly wordDistribution: { [word: string]: number };
}

export function words(
  supplier: TextContentSupplier,
  regEx: RegExp = wordsInTextRegEx,
): TextWords | undefined {
  const words = supplier.text.toLowerCase().match(regEx);
  if (!words || words.length === 0) {
    return undefined;
  }
  return {
    words: words,
    wordCount: words.length,
  };
}

export function wordsDistribution(
  supplier: TextContentSupplier,
  regEx: RegExp = wordsInTextRegEx,
): TextWordDistribution | undefined {
  const tw = words(supplier, regEx);
  if (!tw) return undefined;
  const distr: { [word: string]: number } = {};
  tw.words.forEach((word) => {
    const count = distr[word];
    distr[word] = count ? count + 1 : 1;
  });
  return {
    ...tw,
    wordDistribution: distr,
  };
}

export interface TextContentSupplier {
  readonly text: string;
  readonly onNoTextAvailable?: () => insp.InspectionResult;
}

export interface SuccessfulTextInspection extends insp.SuccessfulInspection {
  isSuccessfulTextInspection: true;
  content: TextContentSupplier;
}

export const isSuccessfulTextInspection = safety.typeGuard<
  SuccessfulTextInspection
>("isSuccessfulTextInspection");

export interface TextInspectionIssue
  extends insp.InspectionIssue, insp.DiagnosableInspectionResult {
  isTextInspectionIssue: true;
}

export const isTextInspectionIssue = safety.typeGuard<
  TextInspectionIssue
>("isTextInspectionIssue");

export function textInspectionSuccess(
  supplier: TextContentSupplier,
): SuccessfulTextInspection {
  return {
    isInspectionResult: true,
    isSuccessfulInspection: true,
    isSuccessfulTextInspection: true,
    content: supplier,
  };
}

export function textIssue(
  message: string,
): TextInspectionIssue {
  return {
    isInspectionResult: true,
    isInspectionIssue: true,
    isTextInspectionIssue: true,
    diagnosticMessage: (): string => {
      return message;
    },
  };
}

export class TextInspectionContext
  implements insp.InspectionContext<TextContentSupplier> {
  readonly contentSupplier: TextContentSupplier;

  constructor(
    content: string | TextContentSupplier,
    sanitize?: tr.TransformerSync<
      tr.TransformerContext,
      string | TextContentSupplier
    >,
  ) {
    const sanitized = sanitize ? sanitize.transform(content) : content;
    this.contentSupplier = typeof sanitized == "string"
      ? { text: sanitized }
      : sanitized;
  }

  content(): TextContentSupplier {
    return this.contentSupplier;
  }
}

// deno-lint-ignore no-empty-interface
export interface TextInspectionDiagnostics extends
  insp.InspectionDiagnostics<
    TextContentSupplier,
    TextInspectionContext
  > {
}

export class TextInspectionDiagnosticsRecorder
  extends insp.InspectionDiagnosticsRecorder<
    TextContentSupplier,
    TextInspectionContext
  > {}

export interface TextInspector
  extends insp.Inspector<TextContentSupplier, TextInspectionContext> {
  (
    ctx: TextInspectionContext,
    diags: TextInspectionDiagnostics,
  ): Promise<insp.InspectionResult>;
}

export class TextInspectionSupplier extends insp.TypicalInspectionSupplier<
  TextContentSupplier,
  TextInspectionContext
> {
  static readonly typical = new TextInspectionSupplier();
}
