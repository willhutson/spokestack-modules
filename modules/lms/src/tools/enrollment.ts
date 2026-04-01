/**
 * Enrollment Tools (Phase 6C)
 *
 * Learner enrollment and progress tracking.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// enrollUser
// ---------------------------------------------------------------------------

export const enrollUser: ToolDefinition = {
  name: "enrollUser",
  description: "Enroll a user in a course",
  parameters: {
    type: "object",
    properties: {
      courseId: { type: "string", description: "Course ID" },
      userId: { type: "string", description: "User ID to enroll" },
      dueDate: { type: "string", description: "Completion due date (ISO 8601)" },
      enrolledBy: { type: "string", description: "ID of user who initiated enrollment" },
    },
    required: ["courseId", "userId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `enroll_${Date.now()}`,
        courseId: params.courseId,
        userId: params.userId,
        dueDate: params.dueDate || null,
        enrolledBy: params.enrolledBy || "system",
        progressPercent: 0,
        status: "ENROLLED",
        enrolledAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getEnrollments
// ---------------------------------------------------------------------------

export const getEnrollments: ToolDefinition = {
  name: "getEnrollments",
  description: "Get enrollments for a course or user",
  parameters: {
    type: "object",
    properties: {
      courseId: { type: "string", description: "Filter by course" },
      userId: { type: "string", description: "Filter by user" },
      status: { type: "string", description: "Filter by status", enum: ["ENROLLED", "IN_PROGRESS", "COMPLETED", "DROPPED"] },
    },
    required: [],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "enroll_001", courseId: "course_001", courseTitle: "New Employee Onboarding", userId: "user_001", userName: "Sarah Chen", progressPercent: 75, status: "IN_PROGRESS", enrolledAt: "2025-07-01T09:00:00Z" },
        { id: "enroll_002", courseId: "course_002", courseTitle: "Data Privacy Compliance", userId: "user_001", userName: "Sarah Chen", progressPercent: 100, status: "COMPLETED", enrolledAt: "2025-06-15T09:00:00Z" },
        { id: "enroll_003", courseId: "course_001", courseTitle: "New Employee Onboarding", userId: "user_002", userName: "Mike Johnson", progressPercent: 40, status: "IN_PROGRESS", enrolledAt: "2025-07-05T09:00:00Z" },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// getProgress
// ---------------------------------------------------------------------------

export const getProgress: ToolDefinition = {
  name: "getProgress",
  description: "Get detailed progress for a specific enrollment including lesson completions",
  parameters: {
    type: "object",
    properties: {
      enrollmentId: { type: "string", description: "Enrollment ID" },
    },
    required: ["enrollmentId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        enrollmentId: params.enrollmentId,
        courseTitle: "New Employee Onboarding",
        overallProgress: 75,
        totalLessons: 8,
        completedLessons: 6,
        lastActivityAt: new Date().toISOString(),
        lessons: [
          { lessonId: "lesson_001", title: "Welcome & Overview", status: "COMPLETED", completedAt: "2025-07-01T10:30:00Z", score: null },
          { lessonId: "lesson_002", title: "Company Culture", status: "COMPLETED", completedAt: "2025-07-01T11:15:00Z", score: null },
          { lessonId: "lesson_003", title: "Tools & Systems", status: "COMPLETED", completedAt: "2025-07-02T09:45:00Z", score: null },
          { lessonId: "lesson_004", title: "Security Training", status: "COMPLETED", completedAt: "2025-07-02T14:00:00Z", score: 92 },
          { lessonId: "lesson_005", title: "Team Introduction", status: "COMPLETED", completedAt: "2025-07-03T10:00:00Z", score: null },
          { lessonId: "lesson_006", title: "Process Overview", status: "COMPLETED", completedAt: "2025-07-03T15:00:00Z", score: null },
          { lessonId: "lesson_007", title: "First Project Walkthrough", status: "IN_PROGRESS", completedAt: null, score: null },
          { lessonId: "lesson_008", title: "Final Assessment", status: "NOT_STARTED", completedAt: null, score: null },
        ],
      },
    };
  },
};

// ---------------------------------------------------------------------------
// issueCompletion
// ---------------------------------------------------------------------------

export const issueCompletion: ToolDefinition = {
  name: "issueCompletion",
  description: "Issue a course completion certificate for an enrollment",
  parameters: {
    type: "object",
    properties: {
      enrollmentId: { type: "string", description: "Enrollment ID" },
      certificateTemplate: { type: "string", description: "Certificate template ID" },
      customMessage: { type: "string", description: "Custom message on certificate" },
    },
    required: ["enrollmentId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `cert_${Date.now()}`,
        enrollmentId: params.enrollmentId,
        courseTitle: "New Employee Onboarding",
        userName: "Sarah Chen",
        certificateUrl: `https://cdn.spokestack.io/certs/cert_${Date.now()}.pdf`,
        issuedAt: new Date().toISOString(),
        expiresAt: null,
        templateId: params.certificateTemplate || "default",
      },
    };
  },
};
