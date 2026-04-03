#!/usr/bin/env ts-node
/**
 * CLI: spoke suite <command>
 *
 * Usage:
 *   spoke suite list                          — List available suites
 *   spoke suite plan "Dubai Agency Starter"   — Preview what would install
 *   spoke suite install "Dubai Agency Starter" — Install a suite
 *   spoke suite export --name "My Setup"      — Export current workspace as suite
 */

import { getAllSuites, getSuiteById, planSuiteInstall } from '../suites/index';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
Usage: spoke suite <command>

Commands:
  list                          List available industry suites
  plan <suite-id>               Preview what a suite would install
  install <suite-id>            Install a suite (modules + config + workflows)
  export --name <name>          Export current workspace as a replicable suite
`);
    return;
  }

  if (command === 'list') {
    const suites = getAllSuites();
    console.log(`\nAvailable Suites (${suites.length}):\n`);
    for (const suite of suites) {
      console.log(`  ${suite.id}`);
      console.log(`    ${suite.name} — ${suite.description}`);
      console.log(`    Modules: ${suite.modules.join(', ')}`);
      console.log(`    Region: ${suite.region || 'Global'}`);
      console.log('');
    }
    return;
  }

  if (command === 'plan') {
    const suiteId = args[1];
    if (!suiteId) {
      console.error('Usage: spoke suite plan <suite-id>');
      process.exit(1);
    }
    const suite = getSuiteById(suiteId);
    if (!suite) {
      console.error(`Suite not found: ${suiteId}`);
      process.exit(1);
    }
    const plan = planSuiteInstall(suite);
    console.log(`\nSuite Plan: ${suite.name}\n`);
    console.log(`  Modules to install: ${plan.modulesToInstall.join(', ')}`);
    console.log(`  Config changes: ${JSON.stringify(plan.configChanges)}`);
    console.log(`  Workflows to create: ${plan.workflowsToCreate}`);
    console.log(`  Estimated time: ${plan.estimatedTime}`);
    console.log('\n  Run `spoke suite install ${suiteId}` to execute.\n');
    return;
  }

  if (command === 'install') {
    const suiteId = args[1];
    if (!suiteId) {
      console.error('Usage: spoke suite install <suite-id>');
      process.exit(1);
    }
    const suite = getSuiteById(suiteId);
    if (!suite) {
      console.error(`Suite not found: ${suiteId}`);
      process.exit(1);
    }
    console.log(`\nInstalling suite: ${suite.name}`);
    console.log(`  Modules: ${suite.modules.join(', ')}`);
    console.log('\n  (Requires CORE_URL, BUILDER_URL, AUTH_TOKEN, AGENT_SECRET env vars)');
    console.log('  Suite installation would proceed here in production.\n');
    return;
  }

  if (command === 'export') {
    console.log('\nExport current workspace as a suite definition.');
    console.log('  (Would read installed modules from core API and generate a SuiteDefinition JSON)\n');
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
