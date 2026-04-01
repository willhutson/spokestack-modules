import { describe, it, expect } from "vitest";
import {
  getCanvasConfigs,
  getNodeColor,
  getNodeIcon,
  getEntityLabel,
  getAllRelationships,
} from "../registry";
import { validateManifest } from "../../validator/index";
import type { CanvasConfig, ModuleManifest } from "../../types/index";

const crmConfig: CanvasConfig = {
  nodeType: "DEAL",
  color: "#10B981",
  icon: "handshake",
  entityLabel: "Deal",
  relationships: [
    { sourceField: "contactId", targetModule: "CRM", targetEntity: "contact", label: "contact", edgeStyle: "solid" },
    { sourceField: "projectId", targetModule: "PROJECTS", targetEntity: "project", label: "linked to", edgeStyle: "dashed" },
  ],
};

const analyticsConfig: CanvasConfig = {
  nodeType: "DASHBOARD",
  color: "#6366F1",
  icon: "activity",
  entityLabel: "Dashboard",
  relationships: [],
};

const manifests = [
  { moduleType: "CRM", canvasConfig: crmConfig },
  { moduleType: "ANALYTICS", canvasConfig: analyticsConfig },
  { moduleType: "NO_CANVAS" },
];

describe("getCanvasConfigs", () => {
  it("extracts configs from manifests that have canvasConfig", () => {
    const configs = getCanvasConfigs(manifests);
    expect(configs.size).toBe(2);
    expect(configs.has("CRM")).toBe(true);
    expect(configs.has("ANALYTICS")).toBe(true);
    expect(configs.get("CRM")).toEqual(crmConfig);
  });

  it("skips manifests without canvasConfig", () => {
    const configs = getCanvasConfigs(manifests);
    expect(configs.has("NO_CANVAS")).toBe(false);
  });

  it("returns an empty map for an empty manifest array", () => {
    const configs = getCanvasConfigs([]);
    expect(configs.size).toBe(0);
  });
});

describe("getNodeColor", () => {
  const configs = getCanvasConfigs(manifests);

  it("returns the correct color for a known module", () => {
    expect(getNodeColor("CRM", configs)).toBe("#10B981");
    expect(getNodeColor("ANALYTICS", configs)).toBe("#6366F1");
  });

  it("returns gray default for unknown module", () => {
    expect(getNodeColor("UNKNOWN_MODULE", configs)).toBe("#6B7280");
  });
});

describe("getNodeIcon", () => {
  const configs = getCanvasConfigs(manifests);

  it("returns the correct icon for a known module", () => {
    expect(getNodeIcon("CRM", configs)).toBe("handshake");
  });

  it("returns 'box' fallback for unknown module", () => {
    expect(getNodeIcon("UNKNOWN_MODULE", configs)).toBe("box");
  });
});

describe("getEntityLabel", () => {
  const configs = getCanvasConfigs(manifests);

  it("returns the correct entityLabel for a known module", () => {
    expect(getEntityLabel("CRM", configs)).toBe("Deal");
    expect(getEntityLabel("ANALYTICS", configs)).toBe("Dashboard");
  });

  it("returns the moduleType string as fallback for unknown module", () => {
    expect(getEntityLabel("UNKNOWN_MODULE", configs)).toBe("UNKNOWN_MODULE");
  });
});

describe("getAllRelationships", () => {
  const configs = getCanvasConfigs(manifests);

  it("flattens relationships from all modules", () => {
    const rels = getAllRelationships(configs);
    expect(rels).toHaveLength(2);
  });

  it("includes sourceModule in each relationship", () => {
    const rels = getAllRelationships(configs);
    const crmRels = rels.filter((r) => r.sourceModule === "CRM");
    expect(crmRels).toHaveLength(2);
  });

  it("defaults edgeStyle to 'solid' when not specified", () => {
    const configWithoutEdgeStyle: CanvasConfig = {
      nodeType: "TEST",
      color: "#000000",
      icon: "box",
      entityLabel: "Test",
      relationships: [
        { sourceField: "parentId", targetModule: "OTHER", targetEntity: "item", label: "child of" },
      ],
    };
    const testConfigs = new Map([["TEST", configWithoutEdgeStyle]]);
    const rels = getAllRelationships(testConfigs);
    expect(rels[0].edgeStyle).toBe("solid");
  });

  it("returns empty array when no modules have relationships", () => {
    const noRelConfigs = new Map([["ANALYTICS", analyticsConfig]]);
    const rels = getAllRelationships(noRelConfigs);
    expect(rels).toHaveLength(0);
  });
});

describe("Validator — canvasConfig", () => {
  const baseManifest: ModuleManifest = {
    id: "test",
    moduleType: "TEST",
    name: "Test Module",
    version: "1.0.0",
    description: "Test",
    category: "custom",
    minTier: "FREE",
    agentDefinition: { path: "src/agent/test.ts", name: "test-agent" },
    tools: ["testTool"],
    surfaces: [],
  };

  it("accepts a valid canvasConfig", () => {
    const manifest = { ...baseManifest, canvasConfig: crmConfig };
    const result = validateManifest(manifest);
    const canvasErrors = result.errors.filter((e) => e.includes("canvasConfig"));
    expect(canvasErrors).toHaveLength(0);
  });

  it("accepts manifest without canvasConfig (optional)", () => {
    const result = validateManifest(baseManifest);
    const canvasErrors = result.errors.filter((e) => e.includes("canvasConfig"));
    expect(canvasErrors).toHaveLength(0);
  });

  it("accepts empty relationships array", () => {
    const manifest = { ...baseManifest, canvasConfig: analyticsConfig };
    const result = validateManifest(manifest);
    const canvasErrors = result.errors.filter((e) => e.includes("canvasConfig"));
    expect(canvasErrors).toHaveLength(0);
  });

  it("rejects non-hex color", () => {
    const manifest = { ...baseManifest, canvasConfig: { ...crmConfig, color: "green" } };
    const result = validateManifest(manifest);
    expect(result.errors.some((e) => e.includes("hex color"))).toBe(true);
  });

  it("rejects empty nodeType", () => {
    const manifest = { ...baseManifest, canvasConfig: { ...crmConfig, nodeType: "" } };
    const result = validateManifest(manifest);
    expect(result.errors.some((e) => e.includes("nodeType"))).toBe(true);
  });

  it("rejects empty icon", () => {
    const manifest = { ...baseManifest, canvasConfig: { ...crmConfig, icon: "" } };
    const result = validateManifest(manifest);
    expect(result.errors.some((e) => e.includes("icon"))).toBe(true);
  });

  it("rejects invalid edgeStyle", () => {
    const manifest = {
      ...baseManifest,
      canvasConfig: {
        ...crmConfig,
        relationships: [
          { ...crmConfig.relationships[0], edgeStyle: "wavy" as any },
        ],
      },
    };
    const result = validateManifest(manifest);
    expect(result.errors.some((e) => e.includes("edgeStyle"))).toBe(true);
  });

  it("allows self-referencing relationships", () => {
    const selfRefConfig: CanvasConfig = {
      nodeType: "POST",
      color: "#3B82F6",
      icon: "send",
      entityLabel: "Post",
      relationships: [
        { sourceField: "campaignId", targetModule: "SOCIAL_PUBLISHING", targetEntity: "campaign", label: "part of", edgeStyle: "solid" },
      ],
    };
    const manifest = { ...baseManifest, canvasConfig: selfRefConfig };
    const result = validateManifest(manifest);
    const canvasErrors = result.errors.filter((e) => e.includes("canvasConfig"));
    expect(canvasErrors).toHaveLength(0);
  });
});
