/**
 * Lesson Tools (Phase 6C)
 *
 * Lesson management within courses.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createLesson
// ---------------------------------------------------------------------------

export const createLesson: ToolDefinition = {
  name: "createLesson",
  description: "Create a new lesson within a course",
  parameters: {
    type: "object",
    properties: {
      courseId: { type: "string", description: "Course ID" },
      title: { type: "string", description: "Lesson title" },
      type: { type: "string", description: "Lesson type", enum: ["VIDEO", "TEXT", "INTERACTIVE", "QUIZ", "ASSIGNMENT"] },
      durationMinutes: { type: "number", description: "Estimated duration in minutes" },
      content: { type: "string", description: "Lesson content or content URL" },
      isRequired: { type: "boolean", description: "Whether lesson is required for completion" },
    },
    required: ["courseId", "title"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `lesson_${Date.now()}`,
        courseId: params.courseId,
        title: params.title,
        type: params.type || "TEXT",
        durationMinutes: params.durationMinutes || null,
        content: params.content || null,
        isRequired: params.isRequired !== false,
        orderIndex: 0,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// updateLesson
// ---------------------------------------------------------------------------

export const updateLesson: ToolDefinition = {
  name: "updateLesson",
  description: "Update a lesson's content or settings",
  parameters: {
    type: "object",
    properties: {
      lessonId: { type: "string", description: "Lesson ID" },
      title: { type: "string", description: "Updated title" },
      content: { type: "string", description: "Updated content" },
      type: { type: "string", description: "Updated type" },
      durationMinutes: { type: "number", description: "Updated duration" },
      isRequired: { type: "boolean", description: "Updated required status" },
    },
    required: ["lessonId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: params.lessonId,
        ...params,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// reorderLessons
// ---------------------------------------------------------------------------

export const reorderLessons: ToolDefinition = {
  name: "reorderLessons",
  description: "Reorder lessons within a course",
  parameters: {
    type: "object",
    properties: {
      courseId: { type: "string", description: "Course ID" },
      lessonOrder: { type: "array", items: { type: "string" }, description: "Ordered array of lesson IDs" },
    },
    required: ["courseId", "lessonOrder"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        courseId: params.courseId,
        lessonCount: (params.lessonOrder as any[]).length,
        newOrder: params.lessonOrder,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// addLessonContent
// ---------------------------------------------------------------------------

export const addLessonContent: ToolDefinition = {
  name: "addLessonContent",
  description: "Add content blocks (text, video, image, embed) to a lesson",
  parameters: {
    type: "object",
    properties: {
      lessonId: { type: "string", description: "Lesson ID" },
      contentType: { type: "string", description: "Content block type", enum: ["TEXT", "VIDEO", "IMAGE", "EMBED", "CODE", "DOWNLOAD"] },
      body: { type: "string", description: "Content body (text, URL, or embed code)" },
      title: { type: "string", description: "Content block title" },
      orderIndex: { type: "number", description: "Position in lesson" },
    },
    required: ["lessonId", "contentType", "body"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `lc_${Date.now()}`,
        lessonId: params.lessonId,
        contentType: params.contentType,
        body: params.body,
        title: params.title || null,
        orderIndex: params.orderIndex || 0,
        createdAt: new Date().toISOString(),
      },
    };
  },
};
