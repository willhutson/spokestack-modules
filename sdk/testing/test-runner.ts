/**
 * Module test runner — validates module structure, runs tests,
 * and produces a compatibility report.
 */

import { createMockPrismaClient, type MockPrismaClient } from "./mock-core";
import type { ModuleManifest } from "../types/manifest";

export interface TestContext {
  prisma: MockPrismaClient;
  organizationId: string;
  manifest: ModuleManifest;
}

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface TestSuiteResult {
  moduleName: string;
  passed: number;
  failed: number;
  total: number;
  results: TestResult[];
  duration: number;
}

type TestFn = (ctx: TestContext) => Promise<void>;

interface TestRegistration {
  name: string;
  fn: TestFn;
}

export class ModuleTestRunner {
  private tests: TestRegistration[] = [];
  private manifest: ModuleManifest;
  private additionalModels: string[];

  constructor(manifest: ModuleManifest, additionalModels: string[] = []) {
    this.manifest = manifest;
    this.additionalModels = additionalModels;
  }

  /** Register a test */
  test(name: string, fn: TestFn): void {
    this.tests.push({ name, fn });
  }

  /** Run all registered tests */
  async run(): Promise<TestSuiteResult> {
    const results: TestResult[] = [];
    const suiteStart = Date.now();

    for (const registration of this.tests) {
      const prisma = createMockPrismaClient(this.additionalModels);
      const org = await prisma.organization.create({
        data: { name: "Test Org", slug: "test-org" },
      });

      const ctx: TestContext = {
        prisma,
        organizationId: org.id as string,
        manifest: this.manifest,
      };

      const testStart = Date.now();
      try {
        await registration.fn(ctx);
        results.push({ name: registration.name, passed: true, duration: Date.now() - testStart });
      } catch (err) {
        results.push({
          name: registration.name,
          passed: false,
          duration: Date.now() - testStart,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return {
      moduleName: this.manifest.name,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
      total: results.length,
      results,
      duration: Date.now() - suiteStart,
    };
  }
}
