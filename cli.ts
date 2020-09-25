import { docopt, fs, path } from "./deps.ts";

const repoVersionRegExp = /medigy\/governance@v?(?<version>\d+\.\d+\.\d+)/;

export function determineVersion(
  importMetaURL: string,
  isMain?: boolean,
): string {
  const fileURL = importMetaURL.startsWith("file://")
    ? importMetaURL.substr("file://".length)
    : importMetaURL;
  if (fs.existsSync(fileURL)) {
    return `v0.0.0-local${isMain ? ".main" : ""}`;
  }
  const matched = importMetaURL.match(repoVersionRegExp);
  if (matched) {
    return `v${matched.groups!["version"]}`;
  }
  return `v0.0.0-remote${
    isMain ? `.main(${importMetaURL} ${repoVersionRegExp})` : ""
  }`;
}

export interface CommandHandler {
  (options: docopt.DocOptions): Promise<true | void>;
}

export function isDryRun(options: docopt.DocOptions): boolean {
  const { "--dry-run": dryRun } = options;
  return dryRun ? true : false;
}

export function isVerbose(options: docopt.DocOptions): boolean {
  const { "--verbose": verbose } = options;
  return verbose ? true : false;
}

export function overwrite(options: docopt.DocOptions): boolean {
  const { "--overwrite": overwrite } = options;
  return overwrite ? true : false;
}

export function deps(options: docopt.DocOptions): [string, string] {
  const {
    "--deps": depsTs,
    "--deps-test": depsTestTs,
  } = options;
  return [
    depsTs ? depsTs.toString() : "./deps.ts",
    depsTestTs ? depsTestTs.toString() : "./deps-test.ts",
  ];
}

export function fileNameComponents(
  fileName: string,
): { name: string; extensions: string[] } {
  const dotPosition = fileName.indexOf(".");
  if (dotPosition === -1) {
    return {
      name: fileName,
      extensions: [],
    };
  }
  return {
    name: fileName.substr(0, dotPosition),
    extensions: fileName.substr(dotPosition + 1).split("."),
  };
}

export function forceExtension(
  extn: string,
  we: fs.WalkEntry,
  fnc: { name: string },
): string {
  return `${path.join(path.dirname(we.path), fnc.name)}${extn}`;
}

export async function CLI(
  docoptSpec: string,
  handlers: CommandHandler[],
): Promise<void> {
  try {
    const options = docopt.default(docoptSpec);
    let handled: true | void;
    for (const handler of handlers) {
      handled = await handler(options);
      if (handled) break;
    }
    if (!handled) {
      console.error("Unable to handle validly parsed docoptSpec:");
      console.dir(options);
    }
  } catch (e) {
    console.error(e.message);
  }
}
