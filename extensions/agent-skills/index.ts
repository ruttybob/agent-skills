/**
 * /meta-skill command — injects the using-agent-skills meta-instruction into session.
 *
 *   /meta-skill        → inject as session message (no LLM trigger)
 *   /meta-skill on     → auto-inject on every session start
 *   /meta-skill off    → disable auto-inject
 */

import * as fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const dir = dirname(fileURLToPath(import.meta.url));
const contentPath = join(dir, "meta-skill.md");

export default function (pi: ExtensionAPI) {
  let autoInject = false;
  let injected = false;
  let cached: string | null = null;

  function load(): string | null {
    if (cached) return cached;
    try {
      cached = fs.readFileSync(contentPath, "utf-8");
      return cached;
    } catch {
      return null;
    }
  }

  function inject(ctx: any): boolean {
    if (injected) {
      ctx.ui.notify("Meta-skill already injected this session", "info");
      return false;
    }
    const content = load();
    if (!content) {
      ctx.ui.notify(`⚠ File not found: ${contentPath}`, "error");
      return false;
    }
    pi.sendMessage(
      { customType: "agent-skills-meta", content, display: true },
      { triggerTurn: false },
    );
    injected = true;
    return true;
  }

  // ── Auto-inject on session start ─────────────────────────────────

  pi.on("session_start", async (_event, ctx) => {
    const entries = ctx.sessionManager.getEntries();
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (e.type === "custom" && (e as any).customType === "agent-skills-meta-flag") {
        autoInject = (e as any).data?.enabled ?? false;
        break;
      }
    }

    if (autoInject) inject(ctx);
  });

  // ── /meta-skill command ──────────────────────────────────────────

  pi.registerCommand("meta-skill", {
    description: "Inject using-agent-skills meta-instruction. [on|off] = toggle auto-inject.",
    getArgumentCompletions(prefix: string) {
      return ["on", "off"].filter((o) => o.startsWith(prefix)).map((o) => ({ value: o, label: o }));
    },

    handler: async (args, ctx) => {
      const arg = args?.trim().toLowerCase();

      if (arg === "on") {
        autoInject = true;
        pi.appendEntry("agent-skills-meta-flag", { enabled: true });
        ctx.ui.notify("✓ Auto-inject ON", "info");
        return;
      }

      if (arg === "off") {
        autoInject = false;
        pi.appendEntry("agent-skills-meta-flag", { enabled: false });
        ctx.ui.notify("✓ Auto-inject OFF", "info");
        return;
      }

      if (arg) {
        ctx.ui.notify("Usage: /meta-skill [on|off]", "error");
        return;
      }

      inject(ctx);
    },
  });
}
