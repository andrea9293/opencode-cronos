/**
 * Cronos — OpenCode scheduler plugin
 *
 * Schedule recurring jobs using launchd (Mac), systemd (Linux), schtasks (Windows), or cron fallback.
 * Jobs are stored under ~/.config/opencode/scheduler/ (scoped by workdir).
 *
 * Features:
 * - Survives reboots
 * - Catches up on missed runs (if computer was asleep)
 * - Cross-platform (Mac + Linux + Windows)
 * - Working directory support for MCP configs
 * - Environment variable injection (PATH for node/npx)
 */
import { Plugin } from "@opencode/plugin";
interface BuiltinSkill {
    name: string;
    description: string;
    suggestedPath: string;
    files: Record<string, string>;
}
export declare function getBuiltinSkill(name?: string): BuiltinSkill | undefined;
export declare function installBuiltinSkill(skill: BuiltinSkill, rootDir: string, overwrite?: boolean): {
    directory: string;
    files: string[];
};
export declare function resolvePerlPath(options: {
    override?: string;
    whichPerl: () => string | null;
    fileExists: (path: string) => boolean;
}): string;
export declare function isMissingCrontabError(status: number | undefined, stderr: string): boolean;
declare const _default: Plugin.Plugin;
export default _default;
