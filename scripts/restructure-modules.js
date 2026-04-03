#!/usr/bin/env node
/**
 * Module Restructure Script
 *
 * Migrates modules from old format (src/tools/*.ts, src/agent/*.ts, src/surfaces/*.ts)
 * to new deployment protocol format (agents/, core/, surfaces/, integrations/).
 *
 * New structure per module:
 *   manifest.json, package.json
 *   core/         — routes.json, registry-entry.json
 *   agents/       — tools.json, prompts.json, handoffs.json
 *   surfaces/     — dashboard.json
 *   integrations/ — providers.json
 *   migrations/   — install.ts, uninstall.ts
 *   tests/        — install.test.ts, tools.test.ts
 */

const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.resolve(__dirname, '../modules');

function restructureModule(moduleName) {
  const moduleDir = path.join(MODULES_DIR, moduleName);
  if (!fs.existsSync(moduleDir)) return;

  const manifestPath = path.join(moduleDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Derive moduleType from manifest or module name
  if (!manifest.moduleType) {
    manifest.moduleType = moduleName.toUpperCase().replace(/-/g, '_');
  }
  if (!manifest.name) manifest.name = manifest.displayName || moduleName;
  if (!manifest.description) manifest.description = `${manifest.name} module`;
  if (!manifest.category) manifest.category = 'custom';
  if (!manifest.minTier) manifest.minTier = 'STARTER';
  if (!manifest.tools) manifest.tools = [];
  if (!Array.isArray(manifest.surfaces)) manifest.surfaces = [];

  console.log(`  Restructuring ${moduleName} (${manifest.moduleType})...`);

  // Create new directories
  for (const dir of ['core', 'agents', 'surfaces', 'integrations']) {
    const newDir = path.join(moduleDir, dir);
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
  }

  // --- Generate agents/tools.json from src/tools/ ---
  const toolNames = manifest.tools || [];
  const toolsJson = {
    agentType: manifest.agentDefinition?.name || `${moduleName}_agent`,
    tools: toolNames.map(name => ({
      name,
      description: `${name} tool for ${manifest.name}`,
      method: 'POST',
      path: `/api/v1/modules/${manifest.moduleType.toLowerCase()}/${name}`,
      parameters: {}
    }))
  };

  // Try to read tool descriptions from existing TS files
  const srcToolsDir = path.join(moduleDir, 'src', 'tools');
  if (fs.existsSync(srcToolsDir)) {
    const tsFiles = fs.readdirSync(srcToolsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
    for (const tsFile of tsFiles) {
      const content = fs.readFileSync(path.join(srcToolsDir, tsFile), 'utf-8');
      // Extract descriptions from existing tool definitions
      const descMatches = content.matchAll(/name:\s*["'](\w+)["'][\s\S]*?description:\s*["']([^"']+)["']/g);
      for (const match of descMatches) {
        const tool = toolsJson.tools.find(t => t.name === match[1]);
        if (tool) tool.description = match[2];
      }
    }
  }

  fs.writeFileSync(
    path.join(moduleDir, 'agents', 'tools.json'),
    JSON.stringify(toolsJson, null, 2)
  );

  // --- Generate agents/prompts.json ---
  let systemPromptExtension = `You manage ${manifest.name} functionality.`;
  let capabilities = toolNames.slice(0, 5);

  // Try to extract from existing agent definition
  const agentFiles = [
    path.join(moduleDir, 'src', 'agent', `${moduleName}-agent.ts`),
    path.join(moduleDir, 'src', 'agent', `${moduleName.replace(/-/g, '_')}-agent.ts`),
  ];
  for (const agentFile of agentFiles) {
    if (fs.existsSync(agentFile)) {
      const content = fs.readFileSync(agentFile, 'utf-8');
      const promptMatch = content.match(/system_prompt:\s*`([\s\S]*?)`/);
      if (promptMatch) {
        systemPromptExtension = promptMatch[1].trim().slice(0, 500);
      }
      break;
    }
  }

  const promptsJson = {
    agentType: manifest.agentDefinition?.name || `${moduleName}_agent`,
    systemPromptExtension,
    capabilities,
    handoffs: {}
  };
  fs.writeFileSync(
    path.join(moduleDir, 'agents', 'prompts.json'),
    JSON.stringify(promptsJson, null, 2)
  );

  // --- Generate agents/handoffs.json from handoffTriggers ---
  const handoffsJson = { triggers: [] };
  // Check if the agent definition has handoff triggers
  for (const agentFile of agentFiles) {
    if (fs.existsSync(agentFile)) {
      const content = fs.readFileSync(agentFile, 'utf-8');
      if (content.includes('handoffTriggers')) {
        handoffsJson.triggers = [{ note: 'Defined in agent definition TypeScript file' }];
      }
      break;
    }
  }
  fs.writeFileSync(
    path.join(moduleDir, 'agents', 'handoffs.json'),
    JSON.stringify(handoffsJson, null, 2)
  );

  // --- Generate core/routes.json ---
  const entityName = manifest.moduleType.toLowerCase();
  const routesJson = {
    routes: [
      { method: 'GET', path: `/api/v1/${entityName}`, description: `List ${manifest.name} records`, existing: false },
      { method: 'POST', path: `/api/v1/${entityName}`, description: `Create ${manifest.name} record`, existing: false },
      { method: 'GET', path: `/api/v1/${entityName}/:id`, description: `Get ${manifest.name} record`, existing: false },
      { method: 'PATCH', path: `/api/v1/${entityName}/:id`, description: `Update ${manifest.name} record`, existing: false },
      { method: 'DELETE', path: `/api/v1/${entityName}/:id`, description: `Delete ${manifest.name} record`, existing: false },
    ]
  };
  fs.writeFileSync(
    path.join(moduleDir, 'core', 'routes.json'),
    JSON.stringify(routesJson, null, 2)
  );

  // --- Generate core/registry-entry.json ---
  const registryEntry = {
    moduleType: manifest.moduleType,
    name: manifest.name,
    description: manifest.description,
    category: manifest.category,
    minTier: manifest.minTier,
    price: manifest.price || 0,
    icon: manifest.canvasConfig?.icon || 'box',
    surfaces: (manifest.surfaces || []).map(s => s.id || s.path || 'dashboard')
  };
  fs.writeFileSync(
    path.join(moduleDir, 'core', 'registry-entry.json'),
    JSON.stringify(registryEntry, null, 2)
  );

  // --- Generate surfaces/dashboard.json ---
  const surfacesJson = {
    sidebar: {
      label: manifest.name,
      icon: manifest.canvasConfig?.icon || 'box',
      route: `/${manifest.moduleType.toLowerCase().replace(/_/g, '-')}`,
      badge: null
    },
    surfaces: (manifest.surfaces || []).map(s => ({
      id: s.id,
      type: s.type || 'full-page',
      route: s.route || s.path || null,
      label: s.label || s.id
    }))
  };
  fs.writeFileSync(
    path.join(moduleDir, 'surfaces', 'dashboard.json'),
    JSON.stringify(surfacesJson, null, 2)
  );

  // --- Generate integrations/providers.json ---
  const providersJson = { providers: [] };
  // Check if module has adapters
  const adaptersDir = path.join(moduleDir, 'src', 'adapters');
  if (fs.existsSync(adaptersDir)) {
    const adapterFiles = fs.readdirSync(adaptersDir).filter(f => f.endsWith('.ts'));
    providersJson.providers = adapterFiles.map(f => ({
      name: f.replace('.ts', ''),
      type: 'nango'
    }));
  }
  fs.writeFileSync(
    path.join(moduleDir, 'integrations', 'providers.json'),
    JSON.stringify(providersJson, null, 2)
  );

  console.log(`    ✓ agents/ (tools.json, prompts.json, handoffs.json)`);
  console.log(`    ✓ core/ (routes.json, registry-entry.json)`);
  console.log(`    ✓ surfaces/ (dashboard.json)`);
  console.log(`    ✓ integrations/ (providers.json)`);
}

// Run on all modules
console.log('Restructuring all modules into new deployment protocol format...\n');
const modules = fs.readdirSync(MODULES_DIR).filter(f =>
  fs.statSync(path.join(MODULES_DIR, f)).isDirectory()
);

for (const mod of modules.sort()) {
  restructureModule(mod);
}

console.log(`\nDone. ${modules.length} modules restructured.`);
