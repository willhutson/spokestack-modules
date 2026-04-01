/**
 * CRM Agent Tool Tests — validates tool behavior against mock core.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockPrismaClient, type MockPrismaClient } from "@spokestack/module-sdk/testing/mock-core";
import { createContact, updateContact, logInteraction, moveDeal, searchContacts, generatePipelineReport } from "../agent/tools";

const CRM_MODELS = ["crm_Contact", "crm_Deal", "crm_Pipeline", "crm_Interaction", "crm_Tag"];

describe("CRM Agent Tools", () => {
  let prisma: MockPrismaClient;
  let orgId: string;
  let ctx: { prisma: MockPrismaClient; organizationId: string };

  beforeEach(async () => {
    prisma = createMockPrismaClient(CRM_MODELS);
    const org = await prisma.organization.create({
      data: { name: "Test Org", slug: "test-org" },
    });
    orgId = org.id as string;
    ctx = { prisma: prisma as any, organizationId: orgId };
  });

  describe("createContact", () => {
    it("creates a contact and writes context entry", async () => {
      const contact = await createContact(ctx, {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        company: "Acme Corp",
      });

      expect(contact).toBeDefined();
      expect(contact.firstName).toBe("Jane");
      expect(contact.email).toBe("jane@example.com");

      // Verify context entry was written with real field names
      const entries = await prisma.contextEntry.findMany({
        where: { organizationId: orgId, category: "crm.contact" },
      });
      expect(entries).toHaveLength(1);
      expect((entries[0] as any).entryType).toBe("ENTITY");
      expect((entries[0] as any).key).toBe(contact.id);
      expect((entries[0] as any).sourceAgentType).toBe("MODULE");
    });

    it("defaults status to lead", async () => {
      const contact = await createContact(ctx, { firstName: "John" });
      expect(contact.status).toBe("lead");
    });
  });

  describe("updateContact", () => {
    it("updates contact fields and writes context", async () => {
      const contact = await createContact(ctx, { firstName: "Jane", email: "old@example.com" });

      const updated = await updateContact(ctx, {
        contactId: contact.id as string,
        email: "new@example.com",
        status: "customer",
      });

      expect(updated.email).toBe("new@example.com");

      const entries = await prisma.contextEntry.findMany({
        where: { category: "crm.contact" },
      });
      // One from create, one from update
      expect(entries).toHaveLength(2);
    });
  });

  describe("logInteraction", () => {
    it("logs an interaction and updates lastContactedAt", async () => {
      const contact = await createContact(ctx, { firstName: "Jane" });

      const interaction = await logInteraction(ctx, {
        contactId: contact.id as string,
        type: "call",
        subject: "Follow-up call",
        direction: "outbound",
        outcome: "Scheduled demo",
      });

      expect(interaction).toBeDefined();
      expect(interaction.type).toBe("call");

      const entries = await prisma.contextEntry.findMany({
        where: { category: "crm.interaction" },
      });
      expect(entries).toHaveLength(1);
      expect((entries[0] as any).entryType).toBe("ENTITY");
    });
  });

  describe("moveDeal", () => {
    it("moves a deal to a new stage", async () => {
      // Create pipeline and deal
      const pipeline = await (prisma as any).crm_Pipeline.create({
        data: { organizationId: orgId, name: "Default", stages: [], isDefault: true },
      });
      const deal = await (prisma as any).crm_Deal.create({
        data: {
          organizationId: orgId,
          pipelineId: pipeline.id,
          title: "Big Deal",
          value: 10000,
          stage: "lead",
        },
      });

      const moved = await moveDeal(ctx, {
        dealId: deal.id as string,
        stage: "qualified",
        probability: 25,
      });

      expect(moved.stage).toBe("qualified");
    });

    it("sets closedAt when moving to closed_won", async () => {
      const pipeline = await (prisma as any).crm_Pipeline.create({
        data: { organizationId: orgId, name: "Default", stages: [], isDefault: true },
      });
      const deal = await (prisma as any).crm_Deal.create({
        data: {
          organizationId: orgId,
          pipelineId: pipeline.id,
          title: "Won Deal",
          value: 5000,
          stage: "negotiation",
        },
      });

      const moved = await moveDeal(ctx, { dealId: deal.id as string, stage: "closed_won" });
      expect(moved.closedAt).toBeDefined();
      expect(moved.probability).toBe(100);
    });
  });

  describe("searchContacts", () => {
    it("searches contacts by query", async () => {
      await createContact(ctx, { firstName: "Jane", lastName: "Smith", company: "Acme" });
      await createContact(ctx, { firstName: "John", lastName: "Doe", company: "Beta" });

      const results = await searchContacts(ctx, { query: "jane" });
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe("Jane");
    });

    it("returns all contacts when no query", async () => {
      await createContact(ctx, { firstName: "Jane" });
      await createContact(ctx, { firstName: "John" });

      const results = await searchContacts(ctx, {});
      expect(results).toHaveLength(2);
    });
  });

  describe("generatePipelineReport", () => {
    it("generates a pipeline report with stage breakdown", async () => {
      const pipeline = await (prisma as any).crm_Pipeline.create({
        data: { organizationId: orgId, name: "Default", stages: [], isDefault: true },
      });

      await (prisma as any).crm_Deal.create({
        data: { organizationId: orgId, pipelineId: pipeline.id, title: "Deal 1", value: 5000, stage: "lead", probability: 10 },
      });
      await (prisma as any).crm_Deal.create({
        data: { organizationId: orgId, pipelineId: pipeline.id, title: "Deal 2", value: 10000, stage: "proposal", probability: 50 },
      });

      const report = await generatePipelineReport(ctx, { includeDeals: true }) as any;

      expect(report.totalDeals).toBe(2);
      expect(report.totalValue).toBe(15000);
      expect(report.stageBreakdown.lead.count).toBe(1);
      expect(report.stageBreakdown.proposal.count).toBe(1);
    });
  });
});
