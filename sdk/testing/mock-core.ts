/**
 * Mock Prisma client for module testing.
 * Provides in-memory mocks for all 39 core models
 * so module tests can run without a real database.
 */

type MockRecord = Record<string, unknown>;
type MockStore = Map<string, MockRecord[]>;

interface MockModelDelegate {
  findMany(args?: { where?: Record<string, unknown>; take?: number; skip?: number; orderBy?: Record<string, string> }): Promise<MockRecord[]>;
  findFirst(args?: { where?: Record<string, unknown> }): Promise<MockRecord | null>;
  findUnique(args: { where: Record<string, unknown> }): Promise<MockRecord | null>;
  create(args: { data: MockRecord }): Promise<MockRecord>;
  update(args: { where: Record<string, unknown>; data: MockRecord }): Promise<MockRecord>;
  delete(args: { where: Record<string, unknown> }): Promise<MockRecord>;
  count(args?: { where?: Record<string, unknown> }): Promise<number>;
  upsert(args: { where: Record<string, unknown>; create: MockRecord; update: MockRecord }): Promise<MockRecord>;
}

const CORE_MODEL_NAMES = [
  // Foundation (7)
  "organization", "user", "team", "teamMember", "orgSettings", "orgModule", "featureFlag",
  // Billing (4)
  "billingAccount", "billingTier", "billingMeterEvent", "billingInvoice",
  // Tasks (4)
  "taskList", "task", "taskComment", "taskAttachment",
  // Projects (6)
  "project", "projectPhase", "projectMilestone", "wfCanvas", "wfCanvasNode", "wfCanvasEdge",
  // Briefs (4)
  "brief", "briefPhase", "artifact", "artifactReview",
  // Orders (5)
  "customer", "order", "orderItem", "invoice", "invoiceItem",
  // Agent (4)
  "agentSession", "agentMessage", "contextEntry", "contextMilestone",
  // Infrastructure (5)
  "integration", "notification", "notificationPreference", "fileAsset", "fileVersion",
] as const;

function generateId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function matchesWhere(record: MockRecord, where: Record<string, unknown>): boolean {
  for (const [key, value] of Object.entries(where)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const op = value as Record<string, unknown>;
      if ("in" in op) {
        if (!Array.isArray(op.in) || !op.in.includes(record[key])) return false;
      }
      if ("contains" in op) {
        if (typeof record[key] !== "string" || !(record[key] as string).includes(op.contains as string)) return false;
      }
      if ("gte" in op && (record[key] as number) < (op.gte as number)) return false;
      if ("lte" in op && (record[key] as number) > (op.lte as number)) return false;
      if ("not" in op && record[key] === op.not) return false;
    } else if (record[key] !== value) {
      return false;
    }
  }
  return true;
}

function createModelDelegate(store: MockStore, modelName: string): MockModelDelegate {
  if (!store.has(modelName)) store.set(modelName, []);
  const records = () => store.get(modelName)!;

  return {
    async findMany(args) {
      let result = args?.where ? records().filter((r) => matchesWhere(r, args.where!)) : [...records()];
      if (args?.skip) result = result.slice(args.skip);
      if (args?.take) result = result.slice(0, args.take);
      return result;
    },
    async findFirst(args) {
      if (!args?.where) return records()[0] ?? null;
      return records().find((r) => matchesWhere(r, args.where!)) ?? null;
    },
    async findUnique(args) {
      return records().find((r) => matchesWhere(r, args.where)) ?? null;
    },
    async create(args) {
      const record = { id: generateId(), createdAt: new Date().toISOString(), ...args.data };
      records().push(record);
      return record;
    },
    async update(args) {
      const idx = records().findIndex((r) => matchesWhere(r, args.where));
      if (idx === -1) throw new Error(`${modelName}: record not found`);
      records()[idx] = { ...records()[idx], ...args.data, updatedAt: new Date().toISOString() };
      return records()[idx];
    },
    async delete(args) {
      const idx = records().findIndex((r) => matchesWhere(r, args.where));
      if (idx === -1) throw new Error(`${modelName}: record not found`);
      return records().splice(idx, 1)[0];
    },
    async count(args) {
      if (!args?.where) return records().length;
      return records().filter((r) => matchesWhere(r, args.where!)).length;
    },
    async upsert(args) {
      const existing = records().find((r) => matchesWhere(r, args.where));
      if (existing) {
        Object.assign(existing, args.update, { updatedAt: new Date().toISOString() });
        return existing;
      }
      const record = { id: generateId(), createdAt: new Date().toISOString(), ...args.create };
      records().push(record);
      return record;
    },
  };
}

export type MockPrismaClient = {
  [K in (typeof CORE_MODEL_NAMES)[number]]: MockModelDelegate;
} & {
  $transaction<T>(fn: (tx: MockPrismaClient) => Promise<T>): Promise<T>;
  $reset(): void;
  _store: MockStore;
};

/**
 * Creates a mock Prisma client with in-memory stores for all 39 core models.
 * Also accepts additional model names for module-specific models.
 */
export function createMockPrismaClient(additionalModels: string[] = []): MockPrismaClient {
  const store: MockStore = new Map();
  const allModels = [...CORE_MODEL_NAMES, ...additionalModels];

  const client = {
    _store: store,
    async $transaction<T>(fn: (tx: MockPrismaClient) => Promise<T>): Promise<T> {
      return fn(client as MockPrismaClient);
    },
    $reset() {
      store.clear();
    },
  } as unknown as MockPrismaClient;

  for (const model of allModels) {
    (client as Record<string, unknown>)[model] = createModelDelegate(store, model);
  }

  return client;
}
