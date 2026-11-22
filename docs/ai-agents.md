# AI coding agents

Point your coding agent at the Lever UI guides, so it uses the real API instead
of guessing it.

## In your project

The package includes the guides for the version you installed, with an index
of them:

```text
node_modules/@leverui/components/dist/docs/llms.txt
```

Add this line to your `AGENTS.md`, `CLAUDE.md`, or your agent's rules file:

```text
Before using Lever UI, read node_modules/@leverui/components/dist/docs/llms.txt
and open the guide for each component you use.
```

Agents read that file at the start of each session. Their search tools usually
skip `node_modules`, so the line gives the full path.

## On the web

For tools that read the web instead of your files, the index for the latest
release is at [leverui.com/llms.txt](https://leverui.com/llms.txt). Its links
open the guides on this site.
