/**
 * Tool Sync Script — pulls HTTP tool definitions from the agent builder
 * registry and rewrites all module manifests.
 *
 * Usage:
 *   npm run sync-tools                                    # local agent builder
 *   AGENT_RUNTIME_URL=https://agents.spokestack.io npm run sync-tools  # production
 *   SYNC_MODULE=media-relations npm run sync-tools        # single module
 *
 * The agent builder's GET /api/v1/agents/registry returns:
 *   toolRegistry: { [toolName]: { name, description, method, path, parameters, fixedBody? } }
 *   agentTools: { [agentType]: string[] }
 *
 * For each module with an agentType field, the script:
 *   1. Looks up agentTools[agentType] → tool name list
 *   2. Resolves each name in toolRegistry → full HTTP definition
 *   3. Overwrites manifest.tools with the resolved definitions
 */

import fs from "fs";
import path from "path";

const AGENT_RUNTIME_URL =
  process.env.AGENT_RUNTIME_URL || "http://localhost:8100";
const SYNC_MODULE = process.env.SYNC_MODULE;

interface ToolDefinition {
  name: string;
  description: string;
  method: string;
  path: string;
  parameters: Record<string, unknown>;
  fixedBody?: Record<string, unknown>;
}

interface RegistryResponse {
  toolRegistry: Record<string, ToolDefinition>;
  agentTools: Record<string, string[]>;
}

async function syncTools() {
  console.log(`Fetching tool registry from ${AGENT_RUNTIME_URL}...`);

  const res = await fetch(`${AGENT_RUNTIME_URL}/api/v1/agents/registry`);
  if (!res.ok) {
    throw new Error(`Registry fetch failed: ${res.status} ${res.statusText}`);
  }

  const { toolRegistry, agentTools } = (await res.json()) as RegistryResponse;

  console.log(
    `Registry loaded: ${Object.keys(toolRegistry).length} tools, ${Object.keys(agentTools).length} agent types\n`
  );

  const modulesDir = path.join(process.cwd(), "modules");
  const moduleNames = fs
    .readdirSync(modulesDir)
    .filter((name) => fs.statSync(path.join(modulesDir, name)).isDirectory())
    .filter((name) => !SYNC_MODULE || name === SYNC_MODULE);

  let updated = 0;
  let skipped = 0;
  let warnings = 0;

  for (const moduleName of moduleNames) {
    const manifestPath = path.join(modulesDir, moduleName, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
      skipped++;
      continue;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const agentType: string | undefined = manifest.agentType;

    if (!agentType) {
      console.warn(`  \u26a0 ${moduleName}: no agentType field, skipping`);
      skipped++;
      continue;
    }

    const toolNames = agentTools[agentType] ?? [];
    if (toolNames.length === 0) {
      console.warn(
        `  \u26a0 ${moduleName}: agentType "${agentType}" has no tools in registry`
      );
      skipped++;
      warnings++;
      continue;
    }

    const httpTools: ToolDefinition[] = [];
    const missingTools: string[] = [];

    for (const name of toolNames) {
      const def = toolRegistry[name];
      if (def) {
        httpTools.push(def);
      } else {
        missingTools.push(name);
      }
    }

    if (missingTools.length > 0) {
      console.warn(
        `  \u26a0 ${moduleName}: ${missingTools.length} tools not found in registry: ${missingTools.join(", ")}`
      );
      warnings++;
    }

    if (httpTools.length === 0) {
      console.warn(`  \u26a0 ${moduleName}: no tools resolved, skipping`);
      skipped++;
      continue;
    }

    manifest.tools = httpTools;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    updated++;
    console.log(`  \u2714 ${moduleName}: ${httpTools.length} tools synced`);
  }

  console.log(
    `\nDone. ${updated} updated, ${skipped} skipped, ${warnings} warnings out of ${moduleNames.length} modules.`
  );

  if (updated === 0 && moduleNames.length > 0) {
    console.error("\nERROR: No modules were updated. Check agent builder connectivity.");
    process.exit(1);
  }
}

syncTools().catch((err) => {
  console.error(err);
  process.exit(1);
});
