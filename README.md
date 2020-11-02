# Medigy Governance

Artifacts to help define Medigy schemas and other information governance structures.

## Engineering Sandbox-based development/testing environment setup

The [mgctl-sandbox.env](mgctl-sandbox.env) file contains convenience aliases and environment variables that are useful for development and testing. `mgctl-sandbox.env` is designed to be `source`d into the current shell and assumes that the normal Netspective Medigy workspaces are setup in the standard directory structure. 

`mgctl-sandbox.env` will automatically figure out which directory it's being run from and locate local source files in the relative ancestor path(s). *If you change directories you must run the `source` command again because the location of `mgctl` is computed relative to the current directory where it was run.*

```bash
cd <location of *.lhc-form.json>
source <(curl -Ls https://raw.githubusercontent.com/medigy/governance/master/mgctl-sandbox.env)
mgctl --help
mgctl --version
```

## Production environment setup

The [mgctl-production.env](mgctl-production.env) file contains convenience aliases and environment variables that are useful for production / publishing. 

`mgctl-production.env` is designed to be `source`d into the current shell (or script) and assumes that you want to run the latest versions of `mgctl.ts` and related CLI apps directly from URLs.

`mgctl-production.env` automatically figures out the latest versions using GitHub semver tags.

```bash
cd <location of *.lhc-form.json>
source <(curl -Ls https://raw.githubusercontent.com/medigy/governance/master/mgctl-production.env)
mgctl --help
mgctl --version
```

# HTTP Service Usage

## Engineering Sandbox-based development/testing usage

Start the server:

```bash
cd $HOME/workspaces/github.com/medigy/governance
deno-run mgctl.ts server --verbose
```

In a separate window, try the service:

```bash
cd $HOME/workspaces/gl.infra.medigy.com/institutions/innovators/netspective-communications/unblock-health
curl -H "Content-Type: application/json" --data @offering-profile.lhc-form.json http://localhost:8159/offering-profile/inspect/lform
```

# CLI Usage

Use the following instructions to take an LHC Form JSON file and "type" it as a Medigy Offering Profile. Once "typed" an LHC Form may be validated by the TypeScript compiler a a normal TypeScript file or transpiled to JavaScript.

## Engineering Sandbox-based development/testing usage

```bash
source <(curl -Ls https://raw.githubusercontent.com/medigy/governance/master/mgctl-sandbox.env)
mgctl offering-profile type lform "offering-profile.lhc-form.json" --mg-mod-ref=$MGMOD --gd-mod-ref=$GDMOD --overwrite --verbose && deno fmt
deno run -A --unstable ./offering-profile.lhc-form.auto.ts inspect
deno run -A --unstable ./offering-profile.lhc-form.auto.ts json emit
```

## Production usage

```bash
source <(curl -Ls https://raw.githubusercontent.com/medigy/governance/master/mgctl-production.env)
mgctl offering-profile type lform "offering-profile.lhc-form.json" --mg-mod-ref=$MGMOD --gd-mod-ref=$GDMOD --overwrite --verbose && deno fmt
deno run -A --unstable ./offering-profile.lhc-form.auto.ts inspect
deno run -A --unstable ./offering-profile.lhc-form.auto.ts json emit
```
