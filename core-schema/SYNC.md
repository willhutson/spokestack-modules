# Core Schema Sync Process

This directory contains a **read-only mirror** of the Prisma schema from `spokestack-core`.

## Why a Mirror?

Modules need to reference core models during development (for type generation, mock testing, and schema composition at publish time) without depending on a live core database.

## Sync Process

1. **Automated**: CI runs nightly to diff `spokestack-core/prisma/schema.prisma` against this mirror
2. **On change**: A PR is opened bumping `version.json` with new `coreVersion` and `schemaHash`
3. **Module authors**: Run `pnpm sdk validate` to check if their module is compatible with the latest core schema
4. **Schema hash**: SHA-256 of the normalized schema content, used by modules to declare compatibility

## Manual Sync

```bash
# From repo root
curl -s https://raw.githubusercontent.com/willhutson/spokestack-core/main/prisma/schema.prisma \
  > core-schema/schema.prisma

# Regenerate hash
sha256sum core-schema/schema.prisma | awk '{print $1}' > /tmp/hash
node -e "
  const v = require('./core-schema/version.json');
  const fs = require('fs');
  v.schemaHash = 'sha256:' + fs.readFileSync('/tmp/hash', 'utf8').trim();
  fs.writeFileSync('./core-schema/version.json', JSON.stringify(v, null, 2));
"
```

## Rules

- **Never edit `schema.prisma` directly** — always sync from core
- Module schemas must not redefine or modify core models
- Module schemas connect to core **only** via `organizationId` FK
- Cross-model references go through `ContextEntry`, not direct FKs
