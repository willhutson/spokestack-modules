/**
 * Module packaging CLI — bundles a module for marketplace submission.
 * Usage: pnpm sdk package ./modules/crm
 */

import * as fs from "fs";
import * as path from "path";
import { validateModule } from "./validate";

export interface PackageResult {
  success: boolean;
  outputPath?: string;
  errors: string[];
}

export function packageModule(modulePath: string, outputDir: string = "./dist"): PackageResult {
  const absPath = path.resolve(modulePath);
  const errors: string[] = [];

  // 1. Validate first
  const validation = validateModule(absPath);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // 2. Read manifest
  const manifest = JSON.parse(fs.readFileSync(path.join(absPath, "manifest.json"), "utf-8"));
  const packageName = `${manifest.name.replace(/[^a-z0-9]/gi, "-")}-${manifest.version}`;
  const outPath = path.join(outputDir, packageName);

  // 3. Create output directory
  fs.mkdirSync(outPath, { recursive: true });

  // 4. Copy required files
  const filesToCopy = [
    "manifest.json",
    "prisma/schema.prisma",
    "agent/definition.ts",
    "agent/tools.ts",
    "agent/milestones.ts",
    "surfaces/registry.ts",
    "migrations/install.ts",
    "migrations/uninstall.ts",
    "README.md",
  ];

  for (const file of filesToCopy) {
    const src = path.join(absPath, file);
    const dest = path.join(outPath, file);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }

  // 5. Write package metadata
  fs.writeFileSync(
    path.join(outPath, "package.meta.json"),
    JSON.stringify({
      packagedAt: new Date().toISOString(),
      sdkVersion: "0.1.0",
      manifest: manifest.name,
      version: manifest.version,
    }, null, 2),
  );

  console.log(`\n📦 Packaged: ${outPath}`);
  return { success: true, outputPath: outPath, errors };
}

if (require.main === module) {
  const modulePath = process.argv[2];
  if (!modulePath) {
    console.error("Usage: package <module-path>");
    process.exit(1);
  }
  const result = packageModule(modulePath);
  process.exit(result.success ? 0 : 1);
}
