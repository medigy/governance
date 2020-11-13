// We import build-only modules directly instead of using deps.ts to keep them out of Docker container
import * as giac from "https://denopkg.com/gov-suite/governed-iac@v1.0.4/core/mod.ts";
import * as iacModel from "https://denopkg.com/gov-suite/governed-iac@v1.0.4/models/service/deno.service.giac.ts";
// import * as giac from "../../../../../github.com/gov-suite/governed-iac/core/mod.ts";
// import * as iacModel from "../../../../../github.com/gov-suite/governed-iac/models/service/deno.service.giac.ts";
import * as ap from "https://denopkg.com/shah/artifacts-persistence@v1.1.0/mod.ts";
import * as cm from "https://denopkg.com/shah/context-manager@v1.0.6/mod.ts";
import * as sm from "https://denopkg.com/shah/specification-module@v1.0.6/mod.ts";
import { shcGH } from "./deps-test.ts";

const mggRepo = shcGH.GitHub.singleton.repo(
  { org: "medigy", repo: "governance" },
);
const mggRepoLatestTag = await mggRepo.repoLatestTag();
if (!mggRepoLatestTag) {
  throw new Error("Unable to detect latest version of governed-text-template");
}
const ctx = cm.ctxFactory.projectContext(".");
const port = 8159;

const mgctl =
  `https://denopkg.com/medigy/governance@${mggRepoLatestTag.identity}/mgctl.ts`;

giac.dockerTr.transformDockerArtifacts(
  {
    projectCtx: ctx,
    name: "graph",
    spec: sm.specFactory.spec<giac.ConfiguredServices>(
      new iacModel.DenoServicesConfig(
        ctx,
        iacModel.denoServiceOptions({
          imageTag: "medigy_governance",
          port: port,
          cacheURLs: ["deps.ts", mgctl],
          entryPoint: [
            "/deno",
            "run",
            "-A",
            "--unstable",
            mgctl,
            "server",
            "--verbose",
          ],
        }),
      ),
    ),
    persist: new ap.FileSystemPersistenceHandler({
      projectPath: ".",
      destPath: ".",
      report: ap.consolePersistenceResultReporter,
    }),
    composeBuildContext: ctx.projectPath,
    composeYamlOptions: { lineWidth: 512 },
  },
);
