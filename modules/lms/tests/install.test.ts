/**
 * LMS Install Flow Tests
 *
 * Validates the module manifest and runs install migration with mock prisma.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { install } from "../migrations/install";

describe("LMS Manifest Validation", () => {
  it("loads and validates the LMS manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.name).toBe("@spokestack/lms");
    expect(manifest.displayName).toBe("LMS");
    expect(manifest.version).toBe("0.1.0");
  });

  it("declares required schema models", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.schema.models).toContain("lms_Course");
    expect(manifest.schema.models).toContain("lms_Lesson");
    expect(manifest.schema.models).toContain("lms_Enrollment");
    expect(manifest.schema.prefix).toBe("lms_");
  });

  it("declares an agent definition", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.agent).toBeDefined();
    expect(manifest.agent.name).toBe("lms-agent");
  });

  it("declares migration paths", () => {
    const installPath = path.join(__dirname, "..", "migrations", "install.ts");
    const uninstallPath = path.join(__dirname, "..", "migrations", "uninstall.ts");

    expect(fs.existsSync(installPath)).toBe(true);
    expect(fs.existsSync(uninstallPath)).toBe(true);
  });
});

describe("LMS Install Migration", () => {
  let mockPrisma: any;
  const orgId = "org_test_123";
  const orgModuleId = "orgmod_lms_123";

  beforeEach(() => {
    mockPrisma = {
      lms_Course: {
        create: vi.fn().mockResolvedValue({ id: "course_mock" }),
      },
      contextEntry: {
        create: vi.fn().mockResolvedValue({ id: "ctx_mock" }),
      },
    };
  });

  it("creates two default courses", async () => {
    await install({ prisma: mockPrisma, organizationId: orgId, orgModuleId });

    expect(mockPrisma.lms_Course.create).toHaveBeenCalledTimes(2);

    const firstCall = mockPrisma.lms_Course.create.mock.calls[0][0].data;
    expect(firstCall.title).toBe("New Employee Onboarding");
    expect(firstCall.category).toBe("ONBOARDING");
    expect(firstCall.status).toBe("PUBLISHED");
    expect(firstCall.organizationId).toBe(orgId);

    const secondCall = mockPrisma.lms_Course.create.mock.calls[1][0].data;
    expect(secondCall.title).toBe("Data Privacy & Compliance");
    expect(secondCall.category).toBe("COMPLIANCE");
  });

  it("creates a context entry for the installed module", async () => {
    await install({ prisma: mockPrisma, organizationId: orgId, orgModuleId });

    expect(mockPrisma.contextEntry.create).toHaveBeenCalledTimes(1);

    const ctxData = mockPrisma.contextEntry.create.mock.calls[0][0].data;
    expect(ctxData.organizationId).toBe(orgId);
    expect(ctxData.entryType).toBe("ENTITY");
    expect(ctxData.category).toBe("lms.module");
    expect(ctxData.key).toBe("installed");
    expect(ctxData.value.orgModuleId).toBe(orgModuleId);
    expect(ctxData.value.defaultCourses).toEqual(["New Employee Onboarding", "Data Privacy & Compliance"]);
  });
});
