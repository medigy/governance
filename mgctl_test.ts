import { testingAsserts as ta } from "./deps-test.ts";
import { govnSvcHealth as gsh, path, shell } from "./deps.ts";

// This unit test can be run two ways:
// 1. With an auto-started child server (default)
// 2. Against an externally started server (set using GTT_TEST_BASE_URL env var)
//    export GTT_TEST_BASE_URL=http://localhost:8179
//    deno test -A --unstable

let baseURL = Deno.env.get("MGC_TEST_BASE_URL");
let childHttpServer: shell.RunListenableServiceResult | undefined = undefined;
let httpServerCaption = baseURL;

if (!baseURL) {
  const port = 8159;
  baseURL = `http://localhost:${port}`;
  childHttpServer = shell.startListenableService({
    port: port,
    command: [
      Deno.execPath(),
      "run",
      "-A",
      "--unstable",
      "mgctl.ts",
      "server",
      "--verbose",
    ],
    cwd: path.dirname(path.fromFileUrl(import.meta.url)),
  });
  ta.assert(childHttpServer.serviceIsRunning, `Server must be started`);
  const started = await childHttpServer.waitForListener(10000);
  ta.assert(
    started,
    `Server must start listening at ${baseURL} within 10 seconds:\n ==> ${
      childHttpServer.denoRunOpts.cmd.join(" ")
    }`,
  );
  httpServerCaption = `${baseURL} PID ${childHttpServer.process.pid}`;
}

Deno.test(`mgctl.ts GET service home page (${httpServerCaption})`, async () => {
  const resp = await fetch(`${baseURL}`);
  ta.assertEquals(await resp.text(), "Medigy Governance Controller");
});

Deno.test(`mgctl.ts GET service health (${httpServerCaption})`, async () => {
  const resp = await fetch(`${baseURL}/health`);
  const health = await resp.json();
  ta.assert(gsh.isHealthy(health));
  // ta.assert(gsh.isServiceHealthComponents(health));
  ta.assertEquals(
    health.status,
    "pass",
  );
});

Deno.test(`mgctl.ts POST offering profile validation of Unblock Health v25.1.3 (${httpServerCaption})`, async () => {
  const resp = await fetch(`${baseURL}/offering-profile/inspect/lform`, {
    method: "POST",
    body: JSON.stringify(
      "../../../git.netspective.io/netspective-studios/git-ops-experiments/gitlab-automation-target/test-medigy-governance-offering-profile/Unblock Health Offering Profile v25_1_3.lhc-form.json",
    ),
  });
  const inspectRes = await resp.json();
  ta.assertArrayIncludes(
    Object.keys(inspectRes),
    [
      "inspectionIssues",
      "isInInspectionPipe",
    ],
  );
});

if (childHttpServer) {
  Deno.test({
    name: `toctl.ts stop server (${httpServerCaption})`,
    fn: async () => {
      await childHttpServer!.stop();
    },
    // because httpServer is started outside of this method, we need to let Deno know
    // not to check for resource leaks
    sanitizeOps: false,
    sanitizeResources: false,
  });
}
