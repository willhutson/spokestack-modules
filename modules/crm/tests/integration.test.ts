/**
 * CRM Integration Tests — tests the full module lifecycle against mock core.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockPrismaClient, type MockPrismaClient } from "@spokestack/module-sdk/testing/mock-core";
import { install } from "../migrations/install";
import { createContact, logInteraction, moveDeal, generatePipelineReport } from "../agent/tools";

const CRM_MODELS = ["crm_Contact", "crm_Deal", "crm_Pipeline", "crm_Interaction", "crm_Tag"];

describe("CRM Integration", () => {
  let prisma: MockPrismaClient;
  let orgId: string;
  let orgModuleId: string;

  beforeEach(async () => {
    prisma = createMockPrismaClient(CRM_MODELS);
    const org = await prisma.organization.create({
      data: { name: "Integration Test Org", slug: "int-test" },
    });
    orgId = org.id as string;

    // Create OrgModule record (real core model for module installations)
    const orgModule = await prisma.orgModule.create({
      data: {
        organizationId: orgId,
        moduleType: "CRM",
        active: true,
      },
    });
    orgModuleId = orgModule.id as string;
  });

  it("install creates default pipeline and context entry", async () => {
    await install({ prisma: prisma as any, organizationId: orgId, orgModuleId });

    const pipelines = await (prisma as any).crm_Pipeline.findMany({
      where: { organizationId: orgId },
    });
    expect(pipelines).toHaveLength(1);
    expect(pipelines[0].isDefault).toBe(true);
    expect(pipelines[0].name).toBe("Default Pipeline");

    const entries = await prisma.contextEntry.findMany({
      where: { organizationId: orgId, category: "crm.module" },
    });
    expect(entries).toHaveLength(1);
    expect((entries[0] as any).entryType).toBe("ENTITY");
    expect((entries[0] as any).key).toBe("installed");
  });

  it("full sales workflow: create contact -> log interaction -> create deal -> move to won", async () => {
    await install({ prisma: prisma as any, organizationId: orgId, orgModuleId });
    const ctx = { prisma: prisma as any, organizationId: orgId };

    // 1. Create contact
    const contact = await createContact(ctx, {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@bigco.com",
      company: "BigCo",
      source: "referral",
    });
    expect(contact.firstName).toBe("Alice");

    // 2. Log initial call
    const interaction = await logInteraction(ctx, {
      contactId: contact.id as string,
      type: "call",
      subject: "Discovery call",
      direction: "outbound",
      duration: 1800,
      outcome: "Interested, scheduling demo",
    });
    expect(interaction.type).toBe("call");

    // 3. Create deal
    const pipelines = await (prisma as any).crm_Pipeline.findMany({
      where: { organizationId: orgId, isDefault: true },
    });
    const deal = await (prisma as any).crm_Deal.create({
      data: {
        organizationId: orgId,
        contactId: contact.id,
        pipelineId: pipelines[0].id,
        title: "BigCo Enterprise Deal",
        value: 50000,
        stage: "qualified",
        probability: 25,
      },
    });

    // 4. Move deal through stages
    await moveDeal(ctx, { dealId: deal.id as string, stage: "proposal", probability: 50 });
    await moveDeal(ctx, { dealId: deal.id as string, stage: "negotiation", probability: 75 });
    const wonDeal = await moveDeal(ctx, { dealId: deal.id as string, stage: "closed_won" });

    expect(wonDeal.stage).toBe("closed_won");
    expect(wonDeal.probability).toBe(100);
    expect(wonDeal.closedAt).toBeDefined();

    // 5. Generate pipeline report
    const report = await generatePipelineReport(ctx, {});
    expect(report.totalDeals).toBe(1);
    expect(report.totalValue).toBe(50000);

    // 6. Verify context entries were created throughout
    const allEntries = await prisma.contextEntry.findMany({
      where: { organizationId: orgId },
    });
    // All entries should use real fields
    for (const entry of allEntries) {
      expect((entry as any).entryType).toBeDefined();
      expect((entry as any).category).toBeDefined();
      expect((entry as any).key).toBeDefined();
      expect((entry as any).sourceAgentType).toBe("MODULE");
    }
    // install + contact.created + interaction.logged + 3x deal.moved + pipeline.report
    expect(allEntries.length).toBeGreaterThanOrEqual(6);
  });
});
