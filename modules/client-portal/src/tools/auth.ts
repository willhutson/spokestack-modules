import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const handleGenerateMagicLink: ToolHandler = async (params, _context) => {
  const { userId, expiresInMinutes } = params as {
    userId: string;
    expiresInMinutes?: number;
  };
  const ttl = expiresInMinutes ?? 15;
  const token = `mlk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const expiresAt = new Date(Date.now() + ttl * 60 * 1000).toISOString();

  return {
    success: true,
    data: {
      id: `ml_${Date.now()}`,
      token,
      url: `https://portal.agency.com/auth/magic?token=${token}`,
      userId,
      expiresAt,
      expiresInMinutes: ttl,
    },
  };
};

export const generateMagicLink: ToolDefinition = {
  name: "generateMagicLink",
  description: "Create a magic link for passwordless authentication. The link expires after the specified duration (default 15 minutes).",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "The portal user ID to generate a magic link for" },
      expiresInMinutes: { type: "number", description: "Minutes until the magic link expires. Defaults to 15.", minimum: 1, maximum: 1440 },
    },
    required: ["userId"],
  },
  handler: handleGenerateMagicLink,
};

const handleValidateMagicLink: ToolHandler = async (params, _context) => {
  const { token } = params as { token: string };
  return {
    success: true,
    data: {
      valid: true,
      userId: "cpu_001",
      usedAt: new Date().toISOString(),
      token,
    },
  };
};

export const validateMagicLink: ToolDefinition = {
  name: "validateMagicLink",
  description: "Validate and consume a magic link token. Returns the associated user ID if valid.",
  parameters: {
    type: "object",
    properties: {
      token: { type: "string", description: "The magic link token to validate" },
    },
    required: ["token"],
  },
  handler: handleValidateMagicLink,
};
