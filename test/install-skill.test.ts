import { describe, expect, test } from "bun:test"
import { existsSync, mkdtempSync, readFileSync, rmSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { getBuiltinSkill, installBuiltinSkill } from "../src/index"

describe("installBuiltinSkill", () => {
  test("creates the destination directory when it does not exist", () => {
    const base = mkdtempSync(join(tmpdir(), "opencode-cronos-skill-"))
    const target = join(base, "does", "not", "exist")
    try {
      expect(existsSync(target)).toBe(false)

      const skill = getBuiltinSkill("scheduled-job-best-practices")
      if (!skill) throw new Error("built-in skill missing")

      const installed = installBuiltinSkill(skill, target)

      expect(existsSync(installed.directory)).toBe(true)
      expect(readFileSync(installed.files[0], "utf8")).toContain("scheduled-job-best-practices")
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  test("defaults to the .agents/skills convention", () => {
    const skill = getBuiltinSkill("scheduled-job-best-practices")
    if (!skill) throw new Error("built-in skill missing")
    expect(skill.suggestedPath.startsWith(".agents/skills/")).toBe(true)
  })

  test("still rejects an empty directory", () => {
    const skill = getBuiltinSkill("scheduled-job-best-practices")
    if (!skill) throw new Error("built-in skill missing")
    expect(() => installBuiltinSkill(skill, "   ")).toThrow("cannot be empty")
  })
})
