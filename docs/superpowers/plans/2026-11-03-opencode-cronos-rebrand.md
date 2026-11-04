# Cronos Rebranding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the plugin to `opencode-cronos` across its identity, docs, and license while keeping filesystem and OS-level identifiers unchanged so existing jobs keep working.

**Architecture:** Surface rebrand only. `package.json` and `LICENSE` carry the new identity and credits, `src/index.ts` declares `id: "opencode-cronos"` and the stale `dist/` is rebuilt from it, README documents the fork and its git-only install. Storage paths, cron prefixes, systemd units, and launchd/Task Scheduler labels stay untouched.

**Tech Stack:** TypeScript, Bun (build/test), esbuild, tsc.

**Spec:** `docs/superpowers/specs/2026-11-03-opencode-cronos-rebrand-design.md`

## Global Constraints

- Plugin `id` must be exactly `opencode-cronos`.
- Package `name` must be exactly `opencode-cronos`, `version` exactly `2.1.0`.
- Distribution is git-only: `opencode-cronos@git+https://github.com/andrea9293/opencode-cronos.git`; no npm publish.
- `LICENSE` must retain `Copyright (c) 2025 Different AI` and add `Copyright (c) 2026 Andrea Bravaccino`.
- Do not rename: `~/.config/opencode/opencode-scheduler.json`, `~/.config/opencode/scheduler/`, cron prefix `opencode-scheduler`, systemd/launchd/Windows task identifiers.
- GitHub-facing content in English.

## Review Focus

- Existing scheduled jobs must still run after the rename (on-disk names unchanged) — pinned by a grep check in Task 3.
- `dist/` must never be shipped stale (today it was still the V1 build) — pinned by the `dist` assertion in Task 2.
- `get_version` reads `package.json` at runtime, so it must report `opencode-cronos@2.1.0` — pinned by Task 4.
- A plugin whose `package.json` defines `build`/`prepare`/install scripts cannot be installed from git — pinned by keeping `build:dist` in Task 1.
- Original authorship must stay visible in `package.json`, `LICENSE`, and README — pinned by the `contributors` and license assertions in Task 1.

---

### Task 1: Package identity and license

**Files:**
- Modify: `package.json`
- Modify: `LICENSE`
- Test: `test/identity.test.ts` (create)

**Interfaces:**
- Produces: `package.json` fields consumed by `get_version` (`name`, `version`) and by the git installer (`scripts.build:dist`).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "bun:test"
import { readFileSync } from "fs"
import { join } from "path"

const root = join(import.meta.dir, "..")
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

describe("package identity", () => {
  test("is named opencode-cronos", () => {
    expect(pkg.name).toBe("opencode-cronos")
  })
  test("is version 2.1.0", () => {
    expect(pkg.version).toBe("2.1.0")
  })
  test("credits the original author", () => {
    expect(pkg.contributors).toContainEqual(
      expect.objectContaining({ name: "Benjamin Shafii" }),
    )
  })
  test("points at the fork", () => {
    expect(pkg.repository.url).toContain("andrea9293/opencode-cronos")
    expect(pkg.homepage).toContain("andrea9293/opencode-cronos")
    expect(pkg.bugs.url).toContain("andrea9293/opencode-cronos")
  })
  test("has no git-preparation trigger scripts", () => {
    for (const script of ["build", "prepare", "prepack", "install", "preinstall", "postinstall"]) {
      expect(pkg.scripts?.[script]).toBeUndefined()
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && bun test test/identity.test.ts`
Expected: FAIL — `expect(received).toBe("opencode-cronos")` because the name is `opencode-scheduler`.

- [ ] **Step 3: Update `package.json` and `LICENSE`**

In `package.json`: `"name": "opencode-cronos"`, `"version": "2.1.0"`, `"author": "Andrea Bravaccino"`, add
`"contributors": [{ "name": "Benjamin Shafii", "url": "https://github.com/different-ai/opencode-scheduler" }]`, set
`repository.url` to `git+https://github.com/andrea9293/opencode-cronos.git`, `bugs.url` to `https://github.com/andrea9293/opencode-cronos/issues`,
`homepage` to `https://github.com/andrea9293/opencode-cronos#readme`. Leave every `scripts` entry as is (`build:dist`, `clean`, `test`, `prepublishOnly`, `release:*`, `typecheck`).

In `LICENSE`, keep the existing block and append under it:

```
Copyright (c) 2026 Andrea Bravaccino
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && bun test test/identity.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add package.json LICENSE test/identity.test.ts
git commit -m "chore: rebrand package identity to opencode-cronos"
```

### Task 2: Runtime plugin id

**Files:**
- Modify: `src/index.ts:3543-3545`, `src/index.ts:614`
- Modify: `dist/index.js`, `dist/index.d.ts` (generated)
- Test: `test/identity.test.ts`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: default export of `src/index.ts` whose `id` is `"opencode-cronos"`; `dist/index.js` re-exporting the same object.

- [ ] **Step 1: Extend the failing test**

Append to `test/identity.test.ts`:

```ts
import plugin from "../src/index"

test("plugin id is opencode-cronos", () => {
  expect(plugin.id).toBe("opencode-cronos")
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && bun test test/identity.test.ts`
Expected: FAIL — received `opencode-scheduler`.

- [ ] **Step 3: Change the id and the version fallback in `src/index.ts`**

`Plugin.define({ id: "opencode-cronos", ... })` (line 3544) and the fallback object at line 614 becomes
`{ name: "opencode-cronos", version: "unknown" }`. Do not touch `SCHEDULER_CONFIG`, `CRON_MANAGED_PREFIX`, the supervisor
header, or the tmp-file prefix.

- [ ] **Step 4: Rebuild `dist` and verify it carries the new id**

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && npm run build:dist`
Expected: esbuild reports `dist/index.js`, exit 0.

Run: `node -e "import('./dist/index.js').then(m=>console.log(m.default.id))"`
Expected: `opencode-cronos`

- [ ] **Step 5: Run the whole suite**

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && bun test`
Expected: all tests pass (previous 10 + the new ones).

- [ ] **Step 6: Commit**

```bash
git add src/index.ts dist/ test/identity.test.ts
git commit -m "feat: rename plugin id to opencode-cronos"
```

### Task 3: README rebrand and attribution

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite the header and install section**

Title becomes `# opencode-cronos`. Under it, before the tagline, add:

```
> Fork of [opencode-scheduler](https://github.com/different-ai/opencode-scheduler)
> by Benjamin Shafii (Different AI), maintained by
> [Andrea Bravaccino](https://github.com/andrea9293).
```

Install snippet becomes:

```json
{
  "plugins": ["opencode-cronos@git+https://github.com/andrea9293/opencode-cronos.git"]
}
```

The compatibility note becomes "Requires OpenCode `2.x` and `opencode-cronos` `2.1.x`." Replace remaining prose mentions of
`opencode-scheduler` with `opencode-cronos`, except the attribution line and the upstream link.

- [ ] **Step 2: Verify no stale identity or broken compatibility strings remain**

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && grep -n "opencode-scheduler" README.md`
Expected: only the attribution line and the upstream URL.

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && grep -n "opencode-scheduler" src/index.ts`
Expected: only `SCHEDULER_CONFIG`, `CRON_MANAGED_PREFIX`, the supervisor header, and the tmp-file prefix — the on-disk identifiers.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rebrand README to opencode-cronos with upstream attribution"
```

### Task 4: Publish and verify the installed plugin

**Files:** none (repository state only).

- [ ] **Step 1: Push the branch**

Run: `cd /home/andrea/Documenti/vscode_projects/opencode-cronos && git push origin main`

- [ ] **Step 2: Reinstall from git in the running OpenCode**

Run: `rm -rf ~/.cache/opencode/npm/git-opencode-cronos-* && cd /home/andrea/Documenti/vscode_projects/AIndrew-usage/AIndrew && opencode reload`
Expected: `Configuration reloaded`.

- [ ] **Step 3: Verify the plugin registers as opencode-cronos**

Run: `cd /home/andrea/Documenti/vscode_projects/AIndrew-usage/AIndrew && opencode plugin list`
Expected: a row `opencode-cronos  <commit>  opencode-cronos@git+https://github.com/andrea9293/opencode-cronos.git`.

- [ ] **Step 4: Verify runtime identity**

Call the plugin's `get_version` tool.
Expected: `Cronos Plugin: opencode-cronos@2.1.0` (the tool's label follows the package name).
