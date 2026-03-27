/**
 * Module publish CLI — submits a packaged module to the marketplace.
 * Usage: pnpm sdk publish ./modules/crm
 */

import { packageModule } from "./package";
import { validateModule } from "./validate";
import * as path from "path";

export interface PublishResult {
  success: boolean;
  registryUrl?: string;
  errors: string[];
}

export async function publishModule(modulePath: string): Promise<PublishResult> {
  const absPath = path.resolve(modulePath);
  const errors: string[] = [];

  // 1. Validate
  const validation = validateModule(absPath);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // 2. Package
  const packaged = packageModule(absPath);
  if (!packaged.success) {
    return { success: false, errors: packaged.errors };
  }

  // 3. Submit to registry (placeholder — would POST to marketplace API)
  const registryUrl = process.env.SPOKESTACK_REGISTRY_URL || "https://marketplace.spokestack.io/api/modules";

  console.log(`\n🚀 Publishing to: ${registryUrl}`);
  console.log("   (Registry submission is a placeholder — implement when marketplace API is live)\n");

  return {
    success: true,
    registryUrl,
    errors,
  };
}

if (require.main === module) {
  const modulePath = process.argv[2];
  if (!modulePath) {
    console.error("Usage: publish <module-path>");
    process.exit(1);
  }
  publishModule(modulePath).then((result) => {
    process.exit(result.success ? 0 : 1);
  });
}
