import { describe, expect, test } from "bun:test"
import { readFileSync } from "fs"
import { join } from "path"

const root = join(import.meta.dir, "..")
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

describe("package identity", () => {
  test("is named opencode-cronos", () => {
    expect(pkg.name).toBe("opencode-cronos")
  })
  test("is version 2.2.0", () => {
    expect(pkg.version).toBe("2.2.0")
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

import plugin from "../src/index"

test("plugin id is opencode-cronos", () => {
  expect(plugin.id).toBe("opencode-cronos")
})

import distPlugin from "../dist/index.js"

test("committed dist is not stale", () => {
  expect(distPlugin.id).toBe(plugin.id)
})

describe("attribution", () => {
  const license = readFileSync(join(root, "LICENSE"), "utf8")
  const readme = readFileSync(join(root, "README.md"), "utf8")

  test("LICENSE keeps the upstream copyright", () => {
    expect(license).toContain("Copyright (c) 2025 Different AI")
    expect(license).toContain("Copyright (c) 2026 Andrea Bravaccino")
  })

  test("README credits the upstream project", () => {
    expect(readme).toContain("https://github.com/different-ai/opencode-scheduler")
    expect(readme).toContain("Benjamin Shafii")
  })
})
