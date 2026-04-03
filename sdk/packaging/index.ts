/**
 * Module Packager — reads a module directory and produces a publishable ModulePackage.
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import type { ModulePackage, MarketplaceManifest, MarketplaceToolDefinition, ModulePricing } from "../types/marketplace";

export interface PackageOptions {
  modulesDir?: string;
}

export function packageModule(moduleDir: string, options: PackageOptions = {}): ModulePackage {
  const baseDir = options.modulesDir || process.cwd();
  const fullDir = path.isAbsolute(moduleDir) ? moduleDir : path.join(baseDir, "modules", moduleDir);

  if (!fs.existsSync(fullDir)) {
    throw new Error(`Module directory not found: ${fullDir}`);
  }

  // manifest.json
  const manifestPath = path.join(fullDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json not found in ${fullDir}`);
  }
  const manifest: MarketplaceManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  // agent.json (or fall back to agents/tools.json)
  let tools: MarketplaceToolDefinition[] = [];
  let systemPrompt = "";

  const agentJsonPath = path.join(fullDir, "agent.json");
  const agentsToolsPath = path.join(fullDir, "agents", "tools.json");
  const agentsPromptsPath = path.join(fullDir, "agents", "prompts.json");

  if (fs.existsSync(agentJsonPath)) {
    const agentConfig = JSON.parse(fs.readFileSync(agentJsonPath, "utf-8"));
    tools = agentConfig.tools || [];
    if (agentConfig.systemPrompt) {
      systemPrompt = agentConfig.systemPrompt;
    } else if (agentConfig.systemPromptFile) {
      const promptPath = path.join(fullDir, agentConfig.systemPromptFile);
      if (fs.existsSync(promptPath)) {
        systemPrompt = fs.readFileSync(promptPath, "utf-8");
      }
    }
  } else if (fs.existsSync(agentsToolsPath)) {
    // Fall back to new deployment protocol format
    const agentTools = JSON.parse(fs.readFileSync(agentsToolsPath, "utf-8"));
    tools = agentTools.tools || [];
    if (fs.existsSync(agentsPromptsPath)) {
      const prompts = JSON.parse(fs.readFileSync(agentsPromptsPath, "utf-8"));
      systemPrompt = prompts.systemPromptExtension || "";
    }
  }

  if (!systemPrompt) {
    // Try to find system prompt from src/agent/*.ts files
    const agentDir = path.join(fullDir, "src", "agent");
    if (fs.existsSync(agentDir)) {
      const agentFiles = fs.readdirSync(agentDir).filter(f => f.endsWith(".ts"));
      for (const file of agentFiles) {
        const content = fs.readFileSync(path.join(agentDir, file), "utf-8");
        const match = content.match(/system_prompt:\s*`([\s\S]*?)`/);
        if (match) { systemPrompt = match[1].trim(); break; }
      }
    }
  }

  // pricing.json
  const pricingPath = path.join(fullDir, "pricing.json");
  const pricing: ModulePricing = fs.existsSync(pricingPath)
    ? JSON.parse(fs.readFileSync(pricingPath, "utf-8"))
    : { type: "free" };

  // uiTemplate
  const templatePath = path.join(fullDir, "page.tsx");
  const uiTemplate = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, "utf-8") : undefined;

  // integrity hash
  const canonicalPayload = JSON.stringify({ manifest, tools, systemPrompt, pricing }, null, 0);
  const hash = crypto.createHash("sha256").update(canonicalPayload).digest("hex");

  return { manifest, tools, systemPrompt, uiTemplate, pricing, hash, packagedAt: new Date().toISOString() };
}

export function serializePackage(pkg: ModulePackage): string {
  return JSON.stringify(pkg, null, 2);
}

export function deserializePackage(json: string): ModulePackage {
  return JSON.parse(json);
}
