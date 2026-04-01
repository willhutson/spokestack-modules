/**
 * Module Composer
 *
 * Reads a module directory, loads manifest, agent, tools, and surfaces.
 * Used by the installer to bundle everything before sending to registries.
 */

import * as fs from "fs";
import * as path from "path";
import type { ComposedModule, ModuleManifest, AgentDefinition, ToolDefinition, SurfaceDefinition } from "../types/index";

export function composeModule(moduleDir: string): ComposedModule {
  const absDir = path.resolve(moduleDir);

  // 1. Load manifest
  const manifestPath = path.join(absDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json not found at ${manifestPath}`);
  }
  const manifest: ModuleManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  // 2. Load agent definition (dynamic import not available at compose time,
  //    so we return a placeholder — real loading happens at runtime)
  const agent: AgentDefinition = {
    name: manifest.agentDefinition.name,
    description: manifest.description,
    system_prompt: "",  // loaded at runtime from the agent definition file
    tools: manifest.tools,
  };

  // 3. Collect tool definitions (names from manifest)
  const tools: ToolDefinition[] = manifest.tools.map((name) => ({
    name,
    description: `${name} tool from ${manifest.name} module`,
    parameters: { type: "object" as const, properties: {} },
    handler: async () => ({ success: true }),
  }));

  // 4. Surfaces come directly from manifest
  const surfaces: SurfaceDefinition[] = manifest.surfaces;

  return { manifest, agent, tools, surfaces };
}
