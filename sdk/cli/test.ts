/**
 * Module test CLI — runs module tests using the mock core.
 * Usage: pnpm sdk test ./modules/crm
 */

import * as path from "path";

export async function runModuleTests(modulePath: string): Promise<void> {
  const absPath = path.resolve(modulePath);
  const testsDir = path.join(absPath, "tests");

  console.log(`\nRunning tests for module at: ${absPath}`);
  console.log(`Test directory: ${testsDir}\n`);

  // In a real implementation, this would discover and run test files
  // using vitest or a custom runner. For now, delegate to vitest.
  const { execSync } = await import("child_process");
  try {
    execSync(`npx vitest run --root ${absPath}`, { stdio: "inherit" });
  } catch {
    process.exit(1);
  }
}

if (require.main === module) {
  const modulePath = process.argv[2];
  if (!modulePath) {
    console.error("Usage: test <module-path>");
    process.exit(1);
  }
  runModuleTests(modulePath);
}
