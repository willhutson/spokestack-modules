#!/usr/bin/env node
/**
 * spoke module create <name> — scaffolds a new module from the CRM reference.
 *
 * Usage:
 *   spoke module create my-module
 *   npx @spokestack/sdk create my-module
 *
 * Copies the CRM module structure as a template, replacing names.
 * The CRM module is the reference implementation — every other module
 * should be buildable by copying this structure.
 */

import * as fs from "fs";
import * as path from "path";

interface CreateModuleOptions {
  name: string;
  outputDir: string;
}

/**
 * Convert a kebab-case name to various formats.
 */
function toModuleType(name: string): string {
  return name.toUpperCase().replace(/-/g, "_");
}

function toDisplayName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function toPrefix(name: string): string {
  return name.replace(/-/g, "_") + "_";
}

function toAgentName(name: string): string {
  return `${name}-agent`;
}

/**
 * Generate a Phase 2 manifest.json matching the ModuleManifest interface.
 */
function generateManifest(name: string): string {
  return JSON.stringify(
    {
      id: name,
      moduleType: toModuleType(name),
      name: toDisplayName(name),
      version: "0.1.0",
      description: `${toDisplayName(name)} module for SpokeStack`,
      category: "custom",
      minTier: "STARTER",
      price: 0,
      agentDefinition: {
        path: `src/agent/${name}-agent.ts`,
        name: toAgentName(name),
      },
      tools: [],
      surfaces: [],
      migrations: {
        install: "migrations/install.ts",
        uninstall: "migrations/uninstall.ts",
      },
    },
    null,
    2,
  );
}

/**
 * Generate agent definition file.
 */
function generateAgentDef(name: string): string {
  const displayName = toDisplayName(name);
  return `import type { AgentDefinition } from "../../../../sdk/types/index";

export const ${name.replace(/-/g, "")}AgentDefinition: AgentDefinition = {
  name: "${toAgentName(name)}",
  description: "${displayName} assistant for SpokeStack",
  system_prompt: \`You are the ${displayName} Agent for SpokeStack.
Your role is to help users manage their ${displayName.toLowerCase()} data.
Always be helpful, concise, and proactive.\`,
  tools: [],
};
`;
}

/**
 * Generate barrel export for tools.
 */
function generateToolsIndex(): string {
  return `import type { ToolDefinition } from "../../../../sdk/types/index";

// Add your tool definitions here.
// Each tool must conform to the SDK ToolDefinition type.
// See modules/crm/src/tools/ for reference implementations.

export const allTools: ToolDefinition[] = [];
export const TOOL_NAMES = allTools.map((t) => t.name);
`;
}

/**
 * Generate install migration.
 */
function generateInstall(name: string): string {
  return `/**
 * Install migration — seeds defaults and creates initial ContextEntry records.
 */
export async function install(prisma: any, organizationId: string): Promise<void> {
  await prisma.contextEntry.create({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "${name}.module",
      key: "installed",
      value: { installedAt: new Date().toISOString() },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
`;
}

/**
 * Generate uninstall migration.
 */
function generateUninstall(name: string): string {
  return `/**
 * Uninstall migration — deactivates module and cleans up.
 */
export async function uninstall(prisma: any, organizationId: string): Promise<void> {
  await prisma.orgModule.updateMany({
    where: { organizationId, moduleType: "${toModuleType(name)}" },
    data: { active: false },
  });
}
`;
}

/**
 * Files to create in the new module directory.
 */
const MODULE_FILES: Record<string, (name: string) => string> = {
  "manifest.json": generateManifest,
  "src/agent/AGENT.ts": generateAgentDef,
  "src/tools/index.ts": () => generateToolsIndex(),
  "migrations/install.ts": generateInstall,
  "migrations/uninstall.ts": generateUninstall,
  "tests/.gitkeep": () => "",
  "prisma/.gitkeep": () => "",
  "src/surfaces/.gitkeep": () => "",
};

export function createModule(options: CreateModuleOptions): void {
  const { name, outputDir } = options;
  const moduleDir = path.join(outputDir, name);

  if (fs.existsSync(moduleDir)) {
    console.error(`Directory already exists: ${moduleDir}`);
    process.exit(1);
  }

  console.log(`\nScaffolding module: ${name}\n`);

  for (const [filePath, generator] of Object.entries(MODULE_FILES)) {
    // Replace AGENT placeholder in filename
    const resolvedPath = filePath.replace("AGENT", toAgentName(name));
    const fullPath = path.join(moduleDir, resolvedPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, generator(name));
    console.log(`  Created: ${resolvedPath}`);
  }

  console.log(`\nModule scaffolded at: ${moduleDir}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Add tool definitions in src/tools/`);
  console.log(`  2. Update the agent definition in src/agent/`);
  console.log(`  3. Add surface definitions in src/surfaces/`);
  console.log(`  4. Update manifest.json with tools and surfaces`);
  console.log(`  5. Run: pnpm test\n`);
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  // Support: spoke module create <name> OR create-module <name>
  const nameIdx = args.findIndex((a) => !a.startsWith("-") && a !== "module" && a !== "create");
  const name = nameIdx >= 0 ? args[nameIdx] : undefined;

  if (!name) {
    console.error("Usage: spoke module create <name>");
    process.exit(1);
  }

  createModule({ name, outputDir: path.resolve("modules") });
}
