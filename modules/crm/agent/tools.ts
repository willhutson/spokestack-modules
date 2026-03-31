/**
 * CRM Agent Tools — implementations for each tool declared in the agent definition.
 * These execute via agent-builder's CoreToolkit (direct Prisma calls).
 * Each tool that creates/updates entities writes to ContextEntry.
 *
 * Real ContextEntry fields (from core schema):
 *   entryType: ContextType (ENTITY | PATTERN | PREFERENCE | MILESTONE | INSIGHT)
 *   category: string
 *   key: string (unique per [organizationId, category, key])
 *   value: Json
 *   confidence: float (0-1)
 *   sourceAgentType: AgentType? (MODULE for marketplace modules)
 */

interface ToolContext {
  prisma: any;
  organizationId: string;
}

// ---------------------------------------------------------------------------
// createContact
// ---------------------------------------------------------------------------
export async function createContact(
  ctx: ToolContext,
  params: {
    email?: string;
    phone?: string;
    firstName: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    source?: string;
    status?: string;
  },
) {
  const contact = await ctx.prisma.crm_Contact.create({
    data: {
      organizationId: ctx.organizationId,
      email: params.email,
      phone: params.phone,
      firstName: params.firstName,
      lastName: params.lastName,
      company: params.company,
      jobTitle: params.jobTitle,
      source: params.source || "agent",
      status: params.status || "lead",
    },
  });

  // Write to ContextEntry using real core schema fields
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "crm.contact",
      key: contact.id,
      value: {
        event: "created",
        name: `${params.firstName} ${params.lastName || ""}`.trim(),
        email: params.email,
        company: params.company,
        source: params.source,
      },
      confidence: 0.8,
      sourceAgentType: "MODULE",
    },
  });

  return contact;
}

// ---------------------------------------------------------------------------
// updateContact
// ---------------------------------------------------------------------------
export async function updateContact(
  ctx: ToolContext,
  params: {
    contactId: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    status?: string;
    score?: number;
  },
) {
  const { contactId, ...updateData } = params;
  const filtered = Object.fromEntries(Object.entries(updateData).filter(([, v]) => v !== undefined));

  const contact = await ctx.prisma.crm_Contact.update({
    where: { id: contactId },
    data: filtered,
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "crm.contact",
      key: `${contactId}:updated:${Date.now()}`,
      value: { event: "updated", updatedFields: Object.keys(filtered) },
      confidence: 0.6,
      sourceAgentType: "MODULE",
    },
  });

  return contact;
}

// ---------------------------------------------------------------------------
// logInteraction
// ---------------------------------------------------------------------------
export async function logInteraction(
  ctx: ToolContext,
  params: {
    contactId: string;
    type: string;
    subject?: string;
    body?: string;
    direction?: string;
    duration?: number;
    outcome?: string;
  },
) {
  const interaction = await ctx.prisma.crm_Interaction.create({
    data: {
      organizationId: ctx.organizationId,
      contactId: params.contactId,
      type: params.type,
      subject: params.subject,
      body: params.body,
      direction: params.direction,
      duration: params.duration,
      outcome: params.outcome,
    },
  });

  // Update contact's lastContactedAt
  await ctx.prisma.crm_Contact.update({
    where: { id: params.contactId },
    data: { lastContactedAt: new Date().toISOString() },
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "crm.interaction",
      key: interaction.id,
      value: {
        event: "logged",
        contactId: params.contactId,
        interactionType: params.type,
        direction: params.direction,
        outcome: params.outcome,
      },
      confidence: 0.7,
      sourceAgentType: "MODULE",
    },
  });

  return interaction;
}

// ---------------------------------------------------------------------------
// moveDeal
// ---------------------------------------------------------------------------
export async function moveDeal(
  ctx: ToolContext,
  params: {
    dealId: string;
    stage: string;
    probability?: number;
    lostReason?: string;
  },
) {
  const updateData: Record<string, unknown> = { stage: params.stage };

  if (params.probability !== undefined) {
    updateData.probability = params.probability;
  }

  if (params.stage === "closed_won") {
    updateData.closedAt = new Date().toISOString();
    updateData.probability = 100;
  } else if (params.stage === "closed_lost") {
    updateData.closedAt = new Date().toISOString();
    updateData.probability = 0;
    if (params.lostReason) updateData.lostReason = params.lostReason;
  }

  const deal = await ctx.prisma.crm_Deal.update({
    where: { id: params.dealId },
    data: updateData,
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "crm.deal",
      key: `${params.dealId}:moved:${Date.now()}`,
      value: {
        event: "stage_changed",
        stage: params.stage,
        previousStage: deal.stage,
        value: deal.value,
      },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });

  return deal;
}

// ---------------------------------------------------------------------------
// searchContacts
// ---------------------------------------------------------------------------
export async function searchContacts(
  ctx: ToolContext,
  params: {
    query?: string;
    status?: string;
    tag?: string;
    limit?: number;
  },
) {
  const where: Record<string, unknown> = {
    organizationId: ctx.organizationId,
    deletedAt: null,
  };

  if (params.status) {
    where.status = params.status;
  }

  // Query matching (simplified — in production, use full-text search)
  const contacts = await ctx.prisma.crm_Contact.findMany({
    where,
    take: params.limit || 20,
  });

  // Filter by query string in-memory (mock-compatible)
  if (params.query) {
    const q = params.query.toLowerCase();
    return contacts.filter(
      (c: any) =>
        (c.firstName && c.firstName.toLowerCase().includes(q)) ||
        (c.lastName && c.lastName.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q)),
    );
  }

  return contacts;
}

// ---------------------------------------------------------------------------
// generatePipelineReport
// ---------------------------------------------------------------------------
export async function generatePipelineReport(
  ctx: ToolContext,
  params: {
    pipelineId?: string;
    includeDeals?: boolean;
  },
) {
  // Get pipeline (or default)
  const pipeline = params.pipelineId
    ? await ctx.prisma.crm_Pipeline.findUnique({ where: { id: params.pipelineId } })
    : await ctx.prisma.crm_Pipeline.findFirst({
        where: { organizationId: ctx.organizationId, isDefault: true, deletedAt: null },
      });

  if (!pipeline) {
    return { error: "No pipeline found" };
  }

  // Get all active deals for this pipeline
  const deals = await ctx.prisma.crm_Deal.findMany({
    where: {
      organizationId: ctx.organizationId,
      pipelineId: pipeline.id,
      deletedAt: null,
    },
  });

  // Build stage breakdown
  const stageBreakdown: Record<string, { count: number; totalValue: number; deals: any[] }> = {};
  let totalValue = 0;
  let weightedValue = 0;

  for (const deal of deals) {
    const stage = (deal as any).stage || "unknown";
    if (!stageBreakdown[stage]) {
      stageBreakdown[stage] = { count: 0, totalValue: 0, deals: [] };
    }
    stageBreakdown[stage].count++;
    stageBreakdown[stage].totalValue += (deal as any).value || 0;
    if (params.includeDeals) {
      stageBreakdown[stage].deals.push(deal);
    }
    totalValue += (deal as any).value || 0;
    weightedValue += ((deal as any).value || 0) * ((deal as any).probability || 0) / 100;
  }

  const report = {
    pipeline: { id: pipeline.id, name: (pipeline as any).name },
    totalDeals: deals.length,
    totalValue,
    weightedForecast: weightedValue,
    stageBreakdown,
    generatedAt: new Date().toISOString(),
  };

  // Write report to context
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "INSIGHT",
      category: "crm.pipeline.report",
      key: `${pipeline.id as string}:report:${Date.now()}`,
      value: {
        totalDeals: report.totalDeals,
        totalValue: report.totalValue,
        weightedForecast: report.weightedForecast,
      },
      confidence: 0.5,
      sourceAgentType: "MODULE",
    },
  });

  return report;
}
