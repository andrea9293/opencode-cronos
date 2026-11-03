import { describe, expect, test } from "bun:test"
import { readFileSync } from "fs"
import { join } from "path"

const root = join(import.meta.dir, "..")
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

describe("package identity", () => {
  test("is named cronos", () => {
    expect(pkg.name).toBe("cronos")
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
    expect(pkg.repository.url).toContain("andrea9293/cronos")
    expect(pkg.homepage).toContain("andrea9293/cronos")
    expect(pkg.bugs.url).toContain("andrea9293/cronos")
  })
  test("has no git-preparation trigger scripts", () => {
    for (const script of ["build", "prepare", "prepack", "install", "preinstall", "postinstall"]) {
      expect(pkg.scripts?.[script]).toBeUndefined()
    }
  })
})

import plugin from "../src/index"

test("plugin id is cronos", () => {
  expect(plugin.id).toBe("cronos")
})
