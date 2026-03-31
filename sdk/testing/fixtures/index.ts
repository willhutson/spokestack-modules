/**
 * Shared test fixtures for module development.
 * Matches real core schema model shapes.
 */

export const TEST_ORGANIZATION = {
  id: "org_test_001",
  name: "Test Organization",
  slug: "test-org",
  createdAt: new Date("2025-01-01").toISOString(),
  updatedAt: new Date("2025-01-01").toISOString(),
};

export const TEST_BILLING_ACCOUNT = {
  id: "billing_test_001",
  organizationId: TEST_ORGANIZATION.id,
  tier: "PRO",
  status: "ACTIVE",
  stripeCustomerId: "cus_test_001",
};

export const TEST_USER = {
  id: "user_test_001",
  email: "admin@test-org.com",
  name: "Test Admin",
  supabaseId: "supabase_test_001",
  createdAt: new Date("2025-01-01").toISOString(),
  updatedAt: new Date("2025-01-01").toISOString(),
};

export const TEST_TEAM_MEMBER = {
  id: "member_test_001",
  organizationId: TEST_ORGANIZATION.id,
  userId: TEST_USER.id,
  role: "OWNER",
  joinedAt: new Date("2025-01-01").toISOString(),
};

export const TEST_CUSTOMER = {
  id: "customer_test_001",
  organizationId: TEST_ORGANIZATION.id,
  name: "Jane Smith",
  email: "jane@bigco.com",
  phone: "+1555000001",
  company: "BigCo",
  metadata: {},
  createdAt: new Date("2025-01-15").toISOString(),
};

export const TEST_CUSTOMERS = [
  TEST_CUSTOMER,
  {
    id: "customer_test_002",
    organizationId: TEST_ORGANIZATION.id,
    name: "John Doe",
    email: "john@acme.com",
    phone: "+1555000002",
    company: "Acme Corp",
    metadata: {},
    createdAt: new Date("2025-02-01").toISOString(),
  },
  {
    id: "customer_test_003",
    organizationId: TEST_ORGANIZATION.id,
    name: "Sarah Connor",
    email: "sarah@cyberdyne.com",
    phone: "+1555000003",
    company: "Cyberdyne",
    metadata: { source: "referral" },
    createdAt: new Date("2025-02-15").toISOString(),
  },
];

export const TEST_CONTEXT_ENTRY = {
  id: "ctx_test_001",
  organizationId: TEST_ORGANIZATION.id,
  entryType: "ENTITY",
  category: "crm.contact",
  key: "customer_test_001",
  value: { name: "Jane Smith", company: "BigCo" },
  confidence: 0.8,
  sourceAgentType: "MODULE",
  createdAt: new Date("2025-01-15").toISOString(),
  updatedAt: new Date("2025-01-15").toISOString(),
};

export const TEST_PIPELINE_STAGES = [
  { id: "stage_lead", name: "Lead", order: 0 },
  { id: "stage_qualified", name: "Qualified", order: 1 },
  { id: "stage_proposal", name: "Proposal", order: 2 },
  { id: "stage_negotiation", name: "Negotiation", order: 3 },
  { id: "stage_closed_won", name: "Closed Won", order: 4 },
  { id: "stage_closed_lost", name: "Closed Lost", order: 5 },
];
