# CRM Module

> Full-featured CRM for SpokeStack with AI-powered sales intelligence.

## Overview

The CRM module adds contact management, deal pipelines, interaction tracking, and proactive sales intelligence to your SpokeStack instance. The CRM Agent helps you manage relationships and close deals faster.

## Features

- **Contact Management** — Create, update, search, and tag contacts with lead scoring
- **Deal Pipelines** — Track deals through customizable stages with value and probability
- **Interaction Logging** — Record calls, emails, meetings, and notes against contacts
- **Pipeline Reports** — AI-generated summaries with stage breakdowns and weighted forecasts
- **Proactive Milestones** — Get notified about stale deals, new achievements, and engagement metrics

## Agent Capabilities

The CRM Agent responds to natural language:

- "Add a new contact Jane Smith from Acme Corp"
- "Log a call with Jane — discussed pricing, scheduling demo next week"
- "Move the Acme deal to Proposal stage"
- "Search contacts at BigCo"
- "How's my pipeline looking?"
- "Show me deals that haven't been updated recently"

## Data Model

| Model | Description |
|-------|-------------|
| `crm_Contact` | People in your network with contact details, status, and lead score |
| `crm_Deal` | Opportunities tracked through pipeline stages |
| `crm_Pipeline` | Customizable sales pipelines with stages and probabilities |
| `crm_Interaction` | Logged activities (calls, emails, meetings, notes) |
| `crm_Tag` | Labels for organizing and segmenting contacts |

All models are prefixed with `crm_` and connect to core only via `organizationId`. Cross-module intelligence flows through `ContextEntry`.

## Installation

```bash
# Via SpokeStack marketplace
pnpm sdk install @spokestack/crm

# Or manually
cd modules/crm && pnpm install
```

The installer:
1. Validates compatibility with your core version
2. Creates default sales pipeline (Lead → Qualified → Proposal → Negotiation → Closed Won/Lost)
3. Registers the CRM Agent with your agent-builder instance
4. Activates dashboard widgets and CRM pages
5. Sets up milestone tracking

## Configuration

The module works out of the box. Customize via:
- **Pipeline Stages** — Edit stages in the CRM settings or ask your agent
- **Lead Scoring** — Scores update based on interaction frequency and deal activity
- **Milestones** — Adjust thresholds in the manifest or module settings

## Pricing

- **Tier**: Growth (minimum), Scale (recommended)
- **Price**: $49/month flat rate
- **Trial**: 14-day free trial

## Development

```bash
# Run tests
pnpm test

# Validate module structure
pnpm validate
```
