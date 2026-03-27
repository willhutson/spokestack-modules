#!/usr/bin/env node
/**
 * npx create-spokestack-module — scaffolds a new module project.
 *
 * Usage:
 *   npx create-spokestack-module my-module
 *   npx create-spokestack-module my-module --template full
 */

import * as fs from "fs";
import * as path from "path";

interface ScaffoldOptions {
  name: string;
  template: "basic" | "full";
  outputDir: string;
}

const BASIC_STRUCTURE = [
  "manifest.json",
  "prisma/schema.prisma",
  "agent/definition.ts",
  "agent/tools.ts",
  "surfaces/registry.ts",
  "migrations/install.ts",
  "migrations/uninstall.ts",
  "tests/.gitkeep",
  "README.md",
];

const FULL_STRUCTURE = [
  ...BASIC_STRUCTURE.filter((f) => f !== "tests/.gitkeep"),
  "agent/milestones.ts",
  "surfaces/dashboard.tsx",
  "surfaces/pages/index.tsx",
  "tests/agent.test.ts",
  "tests/schema.test.ts",
  "tests/integration.test.ts",
  "package.json",
];

function toPrefix(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_";
}

function generateManifest(name: string): string {
  const prefix = toPrefix(name);
  const displayName = name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return JSON.stringify(
    {
      name: `@spokestack/${name}`,
      displayName,
      description: `${displayName} module for SpokeStack`,
      version: "0.1.0",
      author: { name: "Your Name", email: "you@example.com" },
      compatibility: { coreVersion: "1.0.0", schemaHash: "" },
      tier: { minimum: "starter", recommended: "growth" },
      pricing: { model: "free", price: 0, currency: "USD", trialDays: 0 },
      schema: { models: [], prefix, dependsOn: [] },
      agent: { name: `${name}-agent`, personality: "", tools: [], contextContributions: [] },
      surfaces: { dashboard: [], pages: [], agentCards: [] },
      milestones: [],
      permissions: { coreRead: ["Organization", "Contact", "ContextEntry"], coreWrite: ["ContextEntry"], ownModels: true },
      conflicts: [],
      enhances: [],
    },
    null,
    2,
  );
}

function generateAgentDefinition(name: string): string {
  return `import type { ModuleAgent } from "@spokestack/module-sdk";

export const ${name.replace(/[-]/g, "")}Agent: ModuleAgent = {
  name: "${name}-agent",
  slug: "${name}-agent",
  intentPatterns: [
    // Add regex patterns that trigger this agent
  ],
  systemPrompt: \`You are the ${name} assistant for SpokeStack.
Your role is to help users manage their ${name} data.
Always be helpful, concise, and proactive.\`,
  tools: [],
  contextContributions: [],
};
`;
}

function generateToolsFile(): string {
  return `import type { AgentToolDefinition } from "@spokestack/module-sdk";

// Define your agent tools here.
// Each tool must be JSON-serializable for registration with agent-builder.
// Tools that create/update entities should write to ContextEntry.

export const tools: AgentToolDefinition[] = [];
`;
}

function generateSurfaceRegistry(name: string): string {
  return `import type { SurfaceRegistry } from "@spokestack/module-sdk";

export const surfaces: SurfaceRegistry = {
  moduleId: "${name}",
  dashboardWidgets: [],
  pages: [],
  agentCards: [],
};
`;
}

function generateInstall(): string {
  return `/**
 * Install migration — seeds defaults and creates initial ContextEntry records.
 */
export async function install(prisma: any, organizationId: string): Promise<void> {
  // Seed default data here
  console.log("Module installed successfully");
}
`;
}

function generateUninstall(): string {
  return `/**
 * Uninstall migration — soft-deletes all module records and deregisters agent.
 */
export async function uninstall(prisma: any, organizationId: string): Promise<void> {
  // Soft-delete all module records (set deletedAt)
  // Deregister agent with agent-builder
  console.log("Module uninstalled successfully");
}
`;
}

function generatePrismaSchema(name: string): string {
  const prefix = toPrefix(name);
  return `// ${name} module schema
// All models must be prefixed with "${prefix}"
// Only FK into core is organizationId

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add your models here:
// model ${prefix}Example {
//   id             String   @id @default(uuid())
//   organizationId String
//   name           String
//   deletedAt      DateTime?
//   createdAt      DateTime @default(now())
//   updatedAt      DateTime @updatedAt
//   @@map("${prefix}examples")
// }
`;
}

function generateReadme(name: string): string {
  const displayName = name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `# ${displayName}

> SpokeStack Module

## Overview

${displayName} module for SpokeStack.

## Installation

Install via the SpokeStack marketplace or CLI:

\`\`\`bash
pnpm sdk install ${name}
\`\`\`

## Agent Capabilities

<!-- Describe what the agent can do -->

## Configuration

<!-- Document configuration options -->
`;
}

export function scaffold(options: ScaffoldOptions): void {
  const { name, template, outputDir } = options;
  const moduleDir = path.join(outputDir, name);
  const files = template === "full" ? FULL_STRUCTURE : BASIC_STRUCTURE;

  console.log(`\nScaffolding ${template} module: ${name}\n`);

  for (const file of files) {
    const filePath = path.join(moduleDir, file);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    let content = "";
    if (file === "manifest.json") content = generateManifest(name);
    else if (file === "agent/definition.ts") content = generateAgentDefinition(name);
    else if (file === "agent/tools.ts") content = generateToolsFile();
    else if (file === "surfaces/registry.ts") content = generateSurfaceRegistry(name);
    else if (file === "migrations/install.ts") content = generateInstall();
    else if (file === "migrations/uninstall.ts") content = generateUninstall();
    else if (file === "prisma/schema.prisma") content = generatePrismaSchema(name);
    else if (file === "README.md") content = generateReadme(name);
    else content = "";

    fs.writeFileSync(filePath, content);
    console.log(`  Created: ${file}`);
  }

  console.log(`\nDone! Module scaffolded at: ${moduleDir}\n`);
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const name = args.find((a) => !a.startsWith("--"));
  const template = args.includes("--template") ? (args[args.indexOf("--template") + 1] as "basic" | "full") : "basic";

  if (!name) {
    console.error("Usage: create-spokestack-module <name> [--template basic|full]");
    process.exit(1);
  }

  scaffold({ name, template, outputDir: process.cwd() });
}
