#!/usr/bin/env node
/**
 * Validates all module manifests have the required publish metadata fields.
 */

const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.resolve(__dirname, '../modules');
const VALID_PRICING_TYPES = ['free', 'subscription', 'paid'];

let valid = 0;
let invalid = 0;
const errors = [];

const dirs = fs.readdirSync(MODULES_DIR).filter(d =>
  fs.statSync(path.join(MODULES_DIR, d)).isDirectory()
);

for (const dir of dirs.sort()) {
  const manifestPath = path.join(MODULES_DIR, dir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) continue;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const moduleErrors = [];

  if (!manifest.type || typeof manifest.type !== 'string') moduleErrors.push('missing type');
  if (!manifest.slug || typeof manifest.slug !== 'string') moduleErrors.push('missing slug');
  if (!manifest.agentType || typeof manifest.agentType !== 'string') moduleErrors.push('missing agentType');
  if (!manifest.pricing || !VALID_PRICING_TYPES.includes(manifest.pricing.type)) moduleErrors.push('missing/invalid pricing');
  if (!manifest.author || !manifest.author.name) moduleErrors.push('missing author');

  if (!/^[A-Z0-9_]+$/.test(manifest.type)) moduleErrors.push(`type "${manifest.type}" not SCREAMING_SNAKE_CASE`);

  if (manifest.pricing?.type === 'subscription' && !manifest.pricing?.monthlyPriceCents) {
    moduleErrors.push('subscription missing monthlyPriceCents');
  }

  if (moduleErrors.length > 0) {
    invalid++;
    errors.push(`  ✗ ${dir}: ${moduleErrors.join(', ')}`);
  } else {
    valid++;
  }
}

const total = valid + invalid;
console.log(`\nManifest Validation: ${valid}/${total} manifests valid\n`);
if (errors.length > 0) {
  console.log('Errors:');
  errors.forEach(e => console.log(e));
}
process.exit(invalid > 0 ? 1 : 0);
