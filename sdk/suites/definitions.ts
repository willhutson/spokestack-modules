/**
 * Suite Definitions — industry-specific module bundles.
 * Derived from erp_staging_lmtd's 16 vertical configurations.
 */

import type { SuiteDefinition } from './types';

export const SUITES: SuiteDefinition[] = [
  {
    id: "dubai-agency-starter",
    name: "Dubai Agency Starter",
    version: "1.0.0",
    description: "Complete setup for creative agencies in the UAE",
    industry: "marketing_agency",
    region: "MENA",
    modules: ["CRM", "CONTENT_STUDIO", "SOCIAL_PUBLISHING", "TIME_LEAVE", "FINANCE", "ANALYTICS", "PUBLISHER", "REPLY", "MEDIA_BUYING"],
    config: { timezone: "Asia/Dubai", currency: "AED", workWeek: [1, 2, 3, 4, 5], language: "en" },
    moduleOverrides: {
      CRM: { pipelineStages: ["Lead", "Pitch", "Proposal", "Retainer", "Active Client"], defaultCurrency: "AED" },
      BRIEFS: { types: ["Campaign Brief", "Content Brief", "Social Brief", "Video Brief"], reviewStages: ["Internal Review", "Client Review", "Final Approval"] },
      TIME_LEAVE: { leaveTypes: ["Annual", "Sick", "Hajj", "Compassionate"] },
    },
    workflows: [
      { entityType: "Brief", action: "status_changed", handler: "agent:brief_writer", config: { conditions: { toStatus: "IN_REVIEW" } } },
      { entityType: "Client", action: "created", handler: "agent:crm_manager" },
      { entityType: "Order", action: "created", handler: "module:FINANCE" },
    ],
    agentPrompts: {
      crm_manager: "You manage client relationships for a creative agency in Dubai. Clients include brands, government entities, and media companies. Currency is AED. Retainers are common.",
      brief_writer: "You write creative briefs for campaigns. Common deliverables: social content, video production, brand identity, event activations.",
    },
    onboarding: {
      welcomeMessage: "Welcome! I'm setting up your agency workspace. Let me ask a few questions about your team and clients.",
      questions: ["How many clients do you typically manage at once?", "What's your primary service — social, video, branding, or something else?", "Do you work with retainer clients or project-based?"],
    },
  },
  {
    id: "pr-communications",
    name: "PR & Communications",
    version: "1.0.0",
    description: "Media relations, press management, and communications workflows",
    industry: "pr_communications",
    modules: ["CRM", "CONTENT_STUDIO", "PUBLISHER", "LISTENING", "ANALYTICS", "REPLY", "CHANNEL"],
    config: { language: "en" },
    moduleOverrides: {
      CRM: { pipelineStages: ["Media Contact", "Pitch", "Coverage", "Follow-up"] },
      BRIEFS: { types: ["Press Release", "Media Kit", "Pitch Deck", "Crisis Response"] },
    },
    agentPrompts: {
      crm_manager: "You manage media relationships and press contacts. Track journalists, outlets, and coverage opportunities.",
      brief_writer: "You draft press releases and media kits. Tone is professional and newsworthy.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your PR workspace! Let's configure your media management tools.",
      questions: ["What industries do your clients operate in?", "How many press releases do you issue monthly?"],
    },
  },
  {
    id: "creative-studio",
    name: "Creative Studio",
    version: "1.0.0",
    description: "Design and creative production workflows",
    industry: "creative_studio",
    modules: ["CONTENT_STUDIO", "TIME_LEAVE", "CRM", "FINANCE"],
    config: { language: "en" },
    moduleOverrides: {
      BRIEFS: { types: ["Design Brief", "Brand Identity Brief", "Packaging Brief", "UI/UX Brief"], reviewStages: ["Internal Review", "Creative Director", "Client Approval"] },
    },
    agentPrompts: {
      brief_writer: "You write creative and design briefs. Focus on visual direction, brand guidelines, and deliverable specifications.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your creative studio workspace!",
      questions: ["What type of design work does your studio focus on?", "How large is your creative team?"],
    },
  },
  {
    id: "consulting-firm",
    name: "Consulting Firm",
    version: "1.0.0",
    description: "Streamlined consulting with contracts, billing, and client management",
    industry: "consulting_firm",
    modules: ["CRM", "TIME_LEAVE", "FINANCE", "CONTRACTS", "ANALYTICS", "RFP", "DELEGATION"],
    config: { language: "en" },
    moduleOverrides: {
      CRM: { pipelineStages: ["Prospect", "Discovery", "Proposal", "Engagement", "Renewal"] },
    },
    agentPrompts: {
      crm_manager: "You manage consulting engagements. Track proposals, SOWs, and client satisfaction.",
    },
    onboarding: {
      welcomeMessage: "Welcome! Let's set up your consulting practice workspace.",
      questions: ["What type of consulting do you provide?", "Do you bill hourly or project-based?"],
    },
  },
  {
    id: "recruitment-agency",
    name: "Recruitment Agency",
    version: "1.0.0",
    description: "Candidate management, scheduling, and placement tracking",
    industry: "recruitment_agency",
    modules: ["CRM", "ENTITIES", "SCHEDULER", "TIME_LEAVE", "ANALYTICS", "CHANNEL"],
    config: { language: "en" },
    moduleOverrides: {
      ENTITIES: { entityTypes: ["Candidate", "Job Opening", "Placement"] },
      CRM: { pipelineStages: ["Sourced", "Screening", "Interview", "Offer", "Placed"] },
    },
    agentPrompts: {
      crm_manager: "You manage recruitment pipelines. Track candidates through sourcing, interviews, offers, and placements.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your recruitment workspace!",
      questions: ["What industries do you recruit for?", "How many placements do you make monthly?"],
    },
  },
  {
    id: "accounting-firm",
    name: "Accounting Firm",
    version: "1.0.0",
    description: "Client accounting with vault, compliance, and deadline management",
    industry: "accounting_firm",
    modules: ["CRM", "FINANCE", "VAULT", "COMPLIANCE", "DEADLINES", "TIME_LEAVE", "ANALYTICS"],
    config: { language: "en" },
    moduleOverrides: {
      DEADLINES: { categories: ["Tax Filing", "Audit", "Regulatory", "Client Reporting"] },
    },
    agentPrompts: {
      crm_manager: "You manage accounting client relationships. Track engagements, tax deadlines, and compliance requirements.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your accounting practice workspace!",
      questions: ["What accounting services do you provide?", "How many clients do you manage?"],
    },
  },
  {
    id: "legal-services",
    name: "Legal Services",
    version: "1.0.0",
    description: "Legal practice management with contracts, deadlines, and compliance",
    industry: "legal_services",
    modules: ["CRM", "CONTRACTS", "DEADLINES", "VAULT", "TIME_LEAVE", "FINANCE", "COMPLIANCE"],
    config: { language: "en" },
    moduleOverrides: {
      CONTRACTS: { types: ["Retainer Agreement", "NDA", "Service Agreement", "Settlement"] },
      DEADLINES: { categories: ["Court Filing", "Statute of Limitations", "Discovery", "Response"] },
    },
    agentPrompts: {
      crm_manager: "You manage legal client relationships and case tracking.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your legal practice workspace!",
      questions: ["What areas of law does your practice cover?", "How many active cases do you typically handle?"],
    },
  },
  {
    id: "hr-consulting",
    name: "HR Consulting",
    version: "1.0.0",
    description: "HR services with surveys, workshops, and team management",
    industry: "hr_consulting",
    modules: ["CRM", "SURVEYS", "NPS", "SCHEDULER", "TIME_LEAVE", "LMS", "ANALYTICS"],
    config: { language: "en" },
    agentPrompts: {
      crm_manager: "You manage HR consulting clients. Track employee engagement surveys, training programs, and workshop scheduling.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your HR consulting workspace!",
      questions: ["What HR services do you specialize in?", "Do you conduct employee surveys or training programs?"],
    },
  },
  {
    id: "it-consulting",
    name: "IT Consulting",
    version: "1.0.0",
    description: "IT services with tickets, sprint planning, and project management",
    industry: "it_consulting",
    modules: ["CRM", "TICKETS", "TIME_LEAVE", "BOARDS", "FINANCE", "ANALYTICS", "ACCESS_CONTROL", "API_MANAGEMENT"],
    config: { language: "en" },
    moduleOverrides: {
      BOARDS: { defaultBoards: ["Sprint Board", "Bug Tracker", "Feature Requests"] },
      TICKETS: { categories: ["Bug", "Feature Request", "Support", "Infrastructure"] },
    },
    agentPrompts: {
      crm_manager: "You manage IT consulting clients. Track projects, sprints, support tickets, and SLAs.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your IT consulting workspace!",
      questions: ["What IT services do you provide?", "Do you use agile/sprint methodology?"],
    },
  },
  {
    id: "event-management",
    name: "Event Management",
    version: "1.0.0",
    description: "Event planning with inventory, vendor coordination, and scheduling",
    industry: "event_management",
    modules: ["CRM", "INVENTORY", "SCHEDULER", "ENTITIES", "TIME_LEAVE", "FINANCE"],
    config: { language: "en" },
    moduleOverrides: {
      ENTITIES: { entityTypes: ["Venue", "Vendor", "Attendee", "Sponsor"] },
      INVENTORY: { categories: ["AV Equipment", "Decor", "Catering Supplies", "Signage"] },
    },
    agentPrompts: {
      crm_manager: "You manage event clients and vendor relationships. Track venues, budgets, and timelines.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your event management workspace!",
      questions: ["What type of events do you organize?", "How many events do you manage per year?"],
    },
  },
  {
    id: "training-development",
    name: "Training & Development",
    version: "1.0.0",
    description: "Training programs with LMS, certifications, and progress tracking",
    industry: "training_development",
    modules: ["LMS", "CERTIFICATIONS", "SURVEYS", "NPS", "CRM", "SCHEDULER", "ANALYTICS"],
    config: { language: "en" },
    agentPrompts: {
      crm_manager: "You manage training clients and program delivery. Track course enrollments, certifications, and learner progress.",
    },
    onboarding: {
      welcomeMessage: "Welcome to your training workspace!",
      questions: ["What subjects do your training programs cover?", "Do you offer certifications?"],
    },
  },
  {
    id: "in-house-team",
    name: "In-House Team",
    version: "1.0.0",
    description: "Internal operations for in-house teams",
    industry: "in_house_team",
    modules: ["TIME_LEAVE", "BOARDS", "WORKFLOWS", "SPOKECHAT", "ANALYTICS"],
    config: { language: "en" },
    agentPrompts: {},
    onboarding: {
      welcomeMessage: "Welcome! Let's set up your team workspace.",
      questions: ["How large is your team?", "What's your primary workflow — projects, tasks, or briefs?"],
    },
  },
  {
    id: "comms-agency-uae",
    name: "UAE Comms Agency",
    version: "1.0.0",
    description: "Complete PR/communications agency setup for the UAE market",
    industry: "comms_agency",
    region: "MENA",
    modules: [
      "CRM", "CONTENT_STUDIO", "SOCIAL_PUBLISHING",
      "LISTENING", "ANALYTICS", "CLIENT_PORTAL", "TIME_LEAVE",
      "MEDIA_RELATIONS", "PRESS_RELEASES", "CRISIS_COMMS",
      "CLIENT_REPORTING", "INFLUENCER_MGMT", "EVENTS",
    ],
    config: { timezone: "Asia/Dubai", currency: "AED", workWeek: [1, 2, 3, 4, 5], language: "en" },
    moduleOverrides: {
      CRM: {
        pipelineStages: ["Prospect", "Pitch", "Proposal", "Retainer", "Active Client", "Dormant"],
        defaultCurrency: "AED",
        clientTypes: ["Brand", "Government Entity", "Semi-Government", "SME", "Startup"],
      },
      BRIEFS: {
        types: ["Media Pitch", "Press Release", "Holding Statement", "Campaign Brief", "Client Report", "Event Brief"],
        reviewStages: ["Internal Review", "Client Review", "Legal Review", "Final Approval"],
      },
      LISTENING: {
        defaultMonitors: ["Client brand names", "Competitor brands", "Industry keywords"],
        sources: ["Gulf News", "The National", "Khaleej Times", "Arabian Business", "Campaign ME"],
      },
      TIME_LEAVE: {
        leaveTypes: ["Annual", "Sick", "Hajj", "Compassionate", "Maternity/Paternity"],
      },
    },
    workflows: [
      { entityType: "Brief", action: "status_changed", handler: "agent:media_relations_agent", config: { conditions: { "metadata.type": "pitch", toStatus: "ACTIVE" } } },
      { entityType: "ContextEntry", action: "created", handler: "webhook:notify_client", config: { conditions: { category: "coverage" } } },
      { entityType: "Project", action: "status_changed", handler: "agent:crisis_comms_agent", config: { conditions: { "metadata.type": "crisis" } } },
      { entityType: "Project", action: "updated", handler: "agent:events_agent", config: { conditions: { "metadata.type": "event", daysUntilEvent: 7 } } },
    ],
    agentPrompts: {
      crm_manager: "You manage client relationships for a PR/communications agency in the UAE. Clients include brands, government entities (tourism boards, economic zones), semi-government organizations, and regional companies. Currency is AED. Retainer agreements are standard — most clients are on monthly retainers of AED 15,000-75,000.",
      media_relations_agent: "You are the media relations specialist for a UAE comms agency. You know the Gulf media landscape: The National, Gulf News, Khaleej Times, Arabian Business, Campaign Middle East, Communicate. You track journalist relationships, manage media lists, and ensure timely pitch follow-ups.",
      crisis_comms_agent: "You handle crisis communications for clients in the UAE. You understand the regulatory environment (NMC, TDRA), cultural sensitivities, and the speed required. A holding statement within 30 minutes, a full response within 2 hours.",
      events_agent: "You plan events across Dubai and Abu Dhabi. You know venues (Madinat Jumeirah, ADNEC, Coca-Cola Arena, Museum of the Future), local logistics, and cultural considerations. You manage guest lists with VIP/media/influencer tiers.",
    },
    onboarding: {
      welcomeMessage: "Welcome to SpokeStack for Comms Agencies! I'll help you set up your workspace for PR and communications. Let's start — who are your current clients?",
      questions: [
        "Who are your top 3 clients right now?",
        "What's your typical retainer structure — monthly, project-based, or a mix?",
        "Do you handle crisis comms, or is that a separate service?",
        "How many journalists are in your regular media outreach?",
        "Do you manage influencer campaigns for clients?",
      ],
    },
  },
];

export function getSuiteById(id: string): SuiteDefinition | undefined {
  return SUITES.find(s => s.id === id);
}

export function getSuitesByVertical(vertical: string): SuiteDefinition[] {
  return SUITES.filter(s => s.industry === vertical);
}

export function getAllSuites(): SuiteDefinition[] {
  return [...SUITES];
}
