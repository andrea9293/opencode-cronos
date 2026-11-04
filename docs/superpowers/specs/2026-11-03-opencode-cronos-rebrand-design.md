# Cronos rebranding — design (short)

Date: 2026-11-03
Status: awaiting approval

## Intent

The `andrea9293/opencode-cronos` fork is distributed via git only. Rename the plugin to
**opencode-cronos** so the identity, links, and credits reflect the fork, without
pretending the original work is ours.

## Goals

- `package.json`: `name` → `opencode-cronos`, `version` → `2.1.0`, `author` → Andrea
  Bravaccino, `contributors` → Benjamin Shafii (with upstream URL),
  `repository` / `bugs` / `homepage` → `andrea9293/opencode-cronos`.
- `src/index.ts`: `Plugin.define({ id: "opencode-cronos" })` and the version-report
  fallback name → `opencode-cronos`. Rebuild `dist/`.
- README: title `# opencode-cronos`, install snippet key stays `opencode-cronos@git+…`, and a
  credit line at the top: fork of opencode-scheduler by Benjamin Shafii
  (Different AI), maintained by Andrea Bravaccino, link to upstream.
- LICENSE: keep `Copyright (c) 2025 Different AI` and add
  `Copyright (c) 2026 Andrea Bravaccino`.
- No npm publish: git specs (`opencode-cronos@git+https://github.com/andrea9293/opencode-cronos.git`)
  are the only supported install path.

## Non-goals

- No rename of on-disk identities: `~/.config/opencode/opencode-scheduler.json`,
  `~/.config/opencode/scheduler/`, cron prefix `opencode-scheduler-*`, systemd
  unit names, launchd labels, Windows task names.
- No migration code.

## Anti-goals

- Breaking jobs already scheduled by existing users (including this machine).
- Hiding upstream authorship.

## Constraints

- MIT requires retaining the original copyright notice.
- Plugin `id` is a public identifier: changing it changes what
  `opencode plugin list` shows and how the plugin is referenced.

## Approach (chosen)

Surface rebrand: identity, docs, license, and links change; filesystem and
OS-level identifiers stay for backward compatibility. Rejected: full rename
with migration (more code, no user-facing benefit today) and full rename
without migration (breaks existing jobs).

## Decisions

- Distribution stays git-only; npm name collisions are irrelevant.
- `README` keeps the historical PRD file untouched.

## Left to the builder

- Exact wording of the credit line and README phrasing.
- Whether to mention the upstream project in `get_version` output beyond the
  name/version.
