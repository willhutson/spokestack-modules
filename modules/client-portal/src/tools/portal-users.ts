import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const handleCreatePortalUser: ToolHandler = async (params, _context) => {
  const { clientId, contactId, email, name } = params as {
    clientId: string;
    contactId?: string;
    email: string;
    name: string;
    password?: string;
  };
  return {
    success: true,
    data: {
      id: `cpu_${Date.now()}`,
      clientId,
      contactId: contactId ?? null,
      email,
      name,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    },
  };
};

export const createPortalUser: ToolDefinition = {
  name: "createPortalUser",
  description: "Create a new portal user linked to a client and optional contact. Returns the user object without password hash.",
  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", description: "The client ID to link this portal user to" },
      contactId: { type: "string", description: "Optional contact ID to link this portal user to" },
      email: { type: "string", description: "Email address for the portal user" },
      name: { type: "string", description: "Display name for the portal user" },
      password: { type: "string", description: "Optional initial password. If omitted, a magic link will be required for first login." },
    },
    required: ["clientId", "email", "name"],
  },
  handler: handleCreatePortalUser,
};

const handleListPortalUsers: ToolHandler = async (params, _context) => {
  const { clientId, isActive } = params as { clientId: string; isActive?: boolean };
  return {
    success: true,
    data: {
      users: [
        {
          id: "cpu_001",
          clientId,
          email: "sarah@clientcorp.com",
          name: "Sarah Chen",
          isActive: isActive !== false,
          createdAt: "2025-11-01T09:00:00Z",
          lastLoginAt: "2026-03-30T14:22:00Z",
        },
        {
          id: "cpu_002",
          clientId,
          email: "james@clientcorp.com",
          name: "James Rivera",
          isActive: isActive !== false,
          createdAt: "2025-12-15T11:30:00Z",
          lastLoginAt: "2026-03-28T09:45:00Z",
        },
      ],
      total: 2,
    },
  };
};

export const listPortalUsers: ToolDefinition = {
  name: "listPortalUsers",
  description: "List portal users for a client with activity information including last login.",
  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", description: "The client ID to list portal users for" },
      isActive: { type: "boolean", description: "Filter by active status. Omit to return all users." },
    },
    required: ["clientId"],
  },
  handler: handleListPortalUsers,
};

const handleDeactivatePortalUser: ToolHandler = async (params, _context) => {
  const { userId } = params as { userId: string };
  return {
    success: true,
    data: {
      id: userId,
      isActive: false,
      deactivatedAt: new Date().toISOString(),
    },
  };
};

export const deactivatePortalUser: ToolDefinition = {
  name: "deactivatePortalUser",
  description: "Deactivate a portal user account. The user will no longer be able to log in.",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "The portal user ID to deactivate" },
    },
    required: ["userId"],
  },
  handler: handleDeactivatePortalUser,
};

const handleManagePortalSessions: ToolHandler = async (params, _context) => {
  const { action, userId, sessionId } = params as {
    action: "list" | "revoke";
    userId: string;
    sessionId?: string;
  };

  if (action === "revoke") {
    return {
      success: true,
      data: {
        revoked: true,
        sessionId: sessionId ?? "all",
        userId,
        revokedAt: new Date().toISOString(),
      },
    };
  }

  return {
    success: true,
    data: {
      sessions: [
        {
          id: "sess_abc123",
          userId,
          ipAddress: "203.0.113.42",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          createdAt: "2026-03-30T14:22:00Z",
          expiresAt: "2026-04-01T14:22:00Z",
        },
        {
          id: "sess_def456",
          userId,
          ipAddress: "198.51.100.17",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
          createdAt: "2026-03-31T08:10:00Z",
          expiresAt: "2026-04-02T08:10:00Z",
        },
      ],
      total: 2,
    },
  };
};

export const managePortalSessions: ToolDefinition = {
  name: "managePortalSessions",
  description: "List or revoke active portal sessions for a user.",
  parameters: {
    type: "object",
    properties: {
      action: { type: "string", enum: ["list", "revoke"], description: "Whether to list sessions or revoke them" },
      userId: { type: "string", description: "The portal user ID" },
      sessionId: { type: "string", description: "Specific session ID to revoke. Omit to revoke all sessions for the user." },
    },
    required: ["action", "userId"],
  },
  handler: handleManagePortalSessions,
};
