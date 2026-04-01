#!/usr/bin/env ts-node
/**
 * CLI command: spoke module test-compose <module1> <module2>
 *
 * Usage:
 *   npx ts-node sdk/cli/test-compose.ts crm finance
 *   npx ts-node sdk/cli/test-compose.ts --all
 */

import * as fs from 'fs';
import * as path from 'path';
import { testModuleCompose, testAllModuleCompose } from '../testing/compose-test';
import type { ModuleManifest } from '../types/index';

const MODULES_DIR = path.resolve(__dirname, '../../modules');

function loadManifest(moduleName: string): ModuleManifest {
  const manifestPath = path.join(MODULES_DIR, moduleName, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as ModuleManifest;
}

function loadAllManifests(): ModuleManifest[] {
  if (!fs.existsSync(MODULES_DIR)) {
    throw new Error(`Modules directory not found: ${MODULES_DIR}`);
  }
  const entries = fs.readdirSync(MODULES_DIR, { withFileTypes: true });
  const manifests: ModuleManifest[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(MODULES_DIR, entry.name, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        manifests.push(JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as ModuleManifest);
      } catch (e) {
        console.warn(`Warning: could not parse manifest for module "${entry.name}": ${e}`);
      }
    }
  }
  return manifests;
}

function printResult(key: string, result: ReturnType<typeof testModuleCompose>) {
  console.log('\n' + (result.passed ? '\u2713' : '\u2717') + ' ' + key);
  if (result.errors.length > 0) {
    console.log('  ERRORS:');
    for (const err of result.errors) {
      console.log(`    [${err.type}] ${err.detail}`);
    }
  }
  if (result.warnings.length > 0) {
    console.log('  WARNINGS:');
    for (const warn of result.warnings) {
      console.log(`    [${warn.type}] ${warn.detail}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--all')) {
    console.log('Running compose tests for all module pairs...\n');
    const allManifests = loadAllManifests();
    const results = testAllModuleCompose(allManifests);

    let totalPassed = 0;
    let totalFailed = 0;

    for (const [key, result] of results) {
      printResult(key, result);
      if (result.passed) totalPassed++;
      else totalFailed++;
    }

    console.log(`\nSummary: ${totalPassed} passed, ${totalFailed} failed`);
    if (totalFailed > 0) process.exit(1);
    return;
  }

  if (args.length < 2) {
    console.error('Usage: spoke module test-compose <module1> <module2>');
    console.error('       spoke module test-compose --all');
    process.exit(1);
  }

  const [module1Name, module2Name] = args;

  let manifest1: ModuleManifest;
  let manifest2: ModuleManifest;
  let allManifests: ModuleManifest[];

  try {
    manifest1 = loadManifest(module1Name);
    manifest2 = loadManifest(module2Name);
    allManifests = loadAllManifests();
  } catch (err) {
    console.error(`Error loading manifests: ${err}`);
    process.exit(1);
  }

  const result = testModuleCompose(manifest1, manifest2, allManifests);
  printResult(`${module1Name} + ${module2Name}`, result);
  console.log('\n' + result.summary);

  if (!result.passed) process.exit(1);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
