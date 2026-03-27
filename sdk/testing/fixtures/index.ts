/**
 * Shared test fixtures for module development.
 */

export const TEST_ORGANIZATION = {
  id: "org_test_001",
  name: "Test Organization",
  slug: "test-org",
  tier: "growth",
  settings: {},
  createdAt: new Date("2025-01-01").toISOString(),
  updatedAt: new Date("2025-01-01").toISOString(),
};

export const TEST_USER = {
  id: "user_test_001",
  organizationId: TEST_ORGANIZATION.id,
  email: "admin@test-org.com",
  name: "Test Admin",
  role: "owner",
  createdAt: new Date("2025-01-01").toISOString(),
  updatedAt: new Date("2025-01-01").toISOString(),
};

export const TEST_CONTACT = {
  id: "contact_test_001",
  organizationId: TEST_ORGANIZATION.id,
  email: "customer@example.com",
  name: "Jane Smith",
  firstName: "Jane",
  lastName: "Smith",
  phone: "+1555000001",
  source: "manual",
  metadata: {},
  createdAt: new Date("2025-01-15").toISOString(),
  updatedAt: new Date("2025-01-15").toISOString(),
};

export const TEST_CONTACTS = [
  TEST_CONTACT,
  {
    id: "contact_test_002",
    organizationId: TEST_ORGANIZATION.id,
    email: "buyer@example.com",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    phone: "+1555000002",
    source: "website",
    metadata: {},
    createdAt: new Date("2025-02-01").toISOString(),
    updatedAt: new Date("2025-02-01").toISOString(),
  },
  {
    id: "contact_test_003",
    organizationId: TEST_ORGANIZATION.id,
    email: "lead@example.com",
    name: "Sarah Connor",
    firstName: "Sarah",
    lastName: "Connor",
    phone: "+1555000003",
    source: "referral",
    metadata: { company: "Cyberdyne" },
    createdAt: new Date("2025-02-15").toISOString(),
    updatedAt: new Date("2025-02-15").toISOString(),
  },
];

export const TEST_PIPELINE_STAGES = [
  { id: "stage_lead", name: "Lead", order: 0 },
  { id: "stage_qualified", name: "Qualified", order: 1 },
  { id: "stage_proposal", name: "Proposal", order: 2 },
  { id: "stage_negotiation", name: "Negotiation", order: 3 },
  { id: "stage_closed_won", name: "Closed Won", order: 4 },
  { id: "stage_closed_lost", name: "Closed Lost", order: 5 },
];
