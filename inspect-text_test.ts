import { testingAsserts as ta } from "./deps-test.ts";
import * as mod from "./inspect-text.ts";

const longText =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
aliquip ex ea commodo consequat. Duis aute irure dolor in 
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
culpa qui officia deserunt mollit anim id est laborum.`;

const shortText = `Lorem ipsum dolor sit amet, consectetur adipiscing`;

const goodText =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
eiusmod tempor.`;

Deno.test(`word count matches expectations`, async () => {
  const diags = new mod.TextInspectionDiagnosticsRecorder();
  const result = await mod.TextInspectionSupplier.typical.inspect(
    new mod.TextInspectionContext(goodText),
    diags,
    mod.inspectWordCountRange,
  );
  ta.assert(mod.isSuccessfulTextInspection(result));
  ta.assertEquals(diags.issues.length, 0);
  ta.assertEquals(diags.exceptions.length, 0);
});

Deno.test(`word count exceeds expectations`, async () => {
  const diags = new mod.TextInspectionDiagnosticsRecorder();
  const result = await mod.TextInspectionSupplier.typical.inspect(
    new mod.TextInspectionContext(longText),
    diags,
    mod.inspectWordCountRange,
  );
  ta.assert(mod.isTextInspectionIssue(result));
  ta.assertEquals(diags.issues.length, 1);
  ta.assertEquals(diags.exceptions.length, 0);

  const issue = diags.issues[0];
  ta.assert(mod.isTextInspectionIssue(issue));
  ta.assertEquals(
    issue.diagnosticMessage(),
    "Word count should be between 10-15 (not 69)",
  );
});

Deno.test(`word count lower than expectations`, async () => {
  const diags = new mod.TextInspectionDiagnosticsRecorder();
  const result = await mod.TextInspectionSupplier.typical.inspect(
    new mod.TextInspectionContext(shortText),
    diags,
    mod.inspectWordCountRange,
  );
  ta.assert(mod.isTextInspectionIssue(result));
  ta.assertEquals(diags.issues.length, 1);
  ta.assertEquals(diags.exceptions.length, 0);

  const issue = diags.issues[0];
  ta.assert(mod.isTextInspectionIssue(issue));
  ta.assertEquals(
    issue.diagnosticMessage(),
    "Word count should be between 10-15 (not 7)",
  );
});

Deno.test(`invalid website`, async () => {
  const diags = new mod.TextInspectionDiagnosticsRecorder();
  const result = await mod.TextInspectionSupplier.typical.inspect(
    new mod.TextInspectionContext("htps://bad.com/url"),
    diags,
    mod.inspectWebsiteURL,
  );
  ta.assert(mod.isTextInspectionIssue(result));
  ta.assertEquals(diags.issues.length, 1);
  ta.assertEquals(diags.exceptions.length, 0);

  const issue = diags.issues[0];
  ta.assert(mod.isTextInspectionIssue(issue));
  ta.assertEquals(
    issue.diagnosticMessage(),
    "Exception while trying to fetch htps://bad.com/url: TypeError: scheme 'htps' not supported",
  );
});
