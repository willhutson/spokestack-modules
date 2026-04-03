#!/usr/bin/env node
/**
 * Add publish metadata to all module manifests.
 * Adds: type, slug, pricing, agentType, author
 */

const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.resolve(__dirname, '../modules');

const MAPPING = {
  'tasks':                 { type: 'TASKS', agentType: 'assistant', pricing: { type: 'free' } },
  'projects':              { type: 'PROJECTS', agentType: 'project_manager', pricing: { type: 'free' } },
  'briefs':                { type: 'BRIEFS', agentType: 'brief_writer', pricing: { type: 'free' } },
  'orders':                { type: 'ORDERS', agentType: 'order_manager', pricing: { type: 'free' } },
  'builder':               { type: 'BUILDER', agentType: 'module_builder', pricing: { type: 'free' } },
  'crm':                   { type: 'CRM', agentType: 'crm_manager', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'social-publishing':     { type: 'SOCIAL_PUBLISHING', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'content-studio':        { type: 'CONTENT_STUDIO', agentType: 'content_creator', pricing: { type: 'subscription', monthlyPriceCents: 1500 } },
  'analytics':             { type: 'ANALYTICS', agentType: 'analyst', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'surveys':               { type: 'SURVEYS', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'listening':             { type: 'LISTENING', agentType: 'social_listener', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'media-buying':          { type: 'MEDIA_BUYING', agentType: 'analyst', pricing: { type: 'subscription', monthlyPriceCents: 1500 } },
  'lms':                   { type: 'LMS', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1500 } },
  'nps':                   { type: 'NPS', agentType: 'nps_analyst', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'time-leave':            { type: 'TIME_LEAVE', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'boards':                { type: 'BOARDS', agentType: 'board_manager', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'finance':               { type: 'FINANCE', agentType: 'order_manager', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'workflows':             { type: 'WORKFLOWS', agentType: 'workflow_designer', pricing: { type: 'subscription', monthlyPriceCents: 1500 } },
  'client-portal':         { type: 'CLIENT_PORTAL', agentType: 'portal_manager', pricing: { type: 'subscription', monthlyPriceCents: 1500 } },
  'spokechat':             { type: 'SPOKECHAT', agentType: 'chat_operator', pricing: { type: 'subscription', monthlyPriceCents: 1500 } },
  'delegation':            { type: 'DELEGATION', agentType: 'delegation_coordinator', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'access-control':        { type: 'ACCESS_CONTROL', agentType: 'access_admin', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'api-management':        { type: 'API_MANAGEMENT', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'publisher':             { type: 'PUBLISHER', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'reply':                 { type: 'REPLY', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'channel':               { type: 'CHANNEL', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'media-relations':       { type: 'MEDIA_RELATIONS', agentType: 'media_relations_manager', pricing: { type: 'subscription', monthlyPriceCents: 2000 } },
  'press-releases':        { type: 'PRESS_RELEASES', agentType: 'press_release_writer', pricing: { type: 'subscription', monthlyPriceCents: 2000 } },
  'crisis-comms':          { type: 'CRISIS_COMMS', agentType: 'crisis_manager', pricing: { type: 'subscription', monthlyPriceCents: 2000 } },
  'client-reporting':      { type: 'CLIENT_REPORTING', agentType: 'client_reporter', pricing: { type: 'subscription', monthlyPriceCents: 2000 } },
  'influencer-management': { type: 'INFLUENCER_MGMT', agentType: 'influencer_manager', pricing: { type: 'subscription', monthlyPriceCents: 2000 } },
  'events':                { type: 'EVENTS', agentType: 'event_planner', pricing: { type: 'subscription', monthlyPriceCents: 2000 } },
  'entities':              { type: 'ENTITIES', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'scheduler':             { type: 'SCHEDULER', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'deadlines':             { type: 'DEADLINES', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'contracts':             { type: 'CONTRACTS', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'vault':                 { type: 'VAULT', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'tickets':               { type: 'TICKETS', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'rfp':                   { type: 'RFP', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1500 } },
  'compliance':            { type: 'COMPLIANCE', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
  'certifications':        { type: 'CERTIFICATIONS', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 500 } },
  'inventory':             { type: 'INVENTORY', agentType: 'assistant', pricing: { type: 'subscription', monthlyPriceCents: 1000 } },
};

const CATEGORY_FIXES = {
  'lms': 'operations',
  'media-buying': 'marketing',
};

const AUTHOR = { name: 'SpokeStack', url: 'https://spokestack.dev' };

let updated = 0;
let errors = 0;

const dirs = fs.readdirSync(MODULES_DIR).filter(d =>
  fs.statSync(path.join(MODULES_DIR, d)).isDirectory()
);

for (const dir of dirs.sort()) {
  const manifestPath = path.join(MODULES_DIR, dir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) continue;

  const mapping = MAPPING[dir];
  if (!mapping) {
    console.warn(`  SKIP: ${dir} — not in mapping table`);
    continue;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    // Add new fields
    manifest.type = mapping.type;
    manifest.slug = dir;
    manifest.agentType = mapping.agentType;
    manifest.pricing = mapping.pricing;
    manifest.author = AUTHOR;

    // Fix missing categories
    if (CATEGORY_FIXES[dir] && !manifest.category) {
      manifest.category = CATEGORY_FIXES[dir];
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    updated++;
    console.log(`  ✓ ${dir}`);
  } catch (err) {
    errors++;
    console.error(`  ✗ ${dir}: ${err.message}`);
  }
}

console.log(`\nDone. ${updated} manifests updated, ${errors} errors.`);
