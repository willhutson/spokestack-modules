import { describe, it, expect } from "vitest";
import { financeAgentDefinition } from "../src/agent/finance-agent";

describe("Finance Agent Definition", () => {
  it("has required AgentDefinition fields", () => {
    expect(financeAgentDefinition.name).toBe("finance-agent");
    expect(financeAgentDefinition.description).toBeTruthy();
    expect(financeAgentDefinition.system_prompt).toBeTruthy();
    expect(Array.isArray(financeAgentDefinition.tools)).toBe(true);
    expect(financeAgentDefinition.tools.length).toBeGreaterThan(0);
  });

  it("includes all 18 tools", () => {
    expect(financeAgentDefinition.tools.length).toBe(18);
  });

  it("tool_names match exported tools", async () => {
    const { allToolNames } = await import("../src/tools/index");
    expect(allToolNames.length).toBe(18);
    financeAgentDefinition.tools.forEach((name) => {
      expect(allToolNames).toContain(name);
    });
  });

  it("contains expected invoice tools", () => {
    const tools = financeAgentDefinition.tools;
    expect(tools).toContain("createInvoice");
    expect(tools).toContain("listInvoices");
    expect(tools).toContain("getInvoice");
    expect(tools).toContain("updateInvoiceStatus");
    expect(tools).toContain("trackPayment");
    expect(tools).toContain("getFinancialSummary");
  });

  it("contains expected budget tools", () => {
    const tools = financeAgentDefinition.tools;
    expect(tools).toContain("setBudget");
    expect(tools).toContain("listBudgets");
    expect(tools).toContain("trackBudgetSpend");
    expect(tools).toContain("getBudgetSummary");
  });

  it("contains expected forecast tools", () => {
    const tools = financeAgentDefinition.tools;
    expect(tools).toContain("forecastRevenue");
    expect(tools).toContain("getRevenueMetrics");
    expect(tools).toContain("listForecastScenarios");
  });
});
