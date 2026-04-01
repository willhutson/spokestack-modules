/**
 * Quiz Tools (Phase 6C)
 *
 * Quiz creation, questions, and assessment.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createQuiz
// ---------------------------------------------------------------------------

export const createQuiz: ToolDefinition = {
  name: "createQuiz",
  description: "Create a quiz for a lesson with passing criteria",
  parameters: {
    type: "object",
    properties: {
      lessonId: { type: "string", description: "Lesson ID" },
      title: { type: "string", description: "Quiz title" },
      passingScore: { type: "number", description: "Minimum passing score (percentage)" },
      maxAttempts: { type: "number", description: "Maximum allowed attempts (0 for unlimited)" },
      timeLimitMinutes: { type: "number", description: "Time limit in minutes (0 for no limit)" },
      shuffleQuestions: { type: "boolean", description: "Randomize question order" },
    },
    required: ["lessonId", "title"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `quiz_${Date.now()}`,
        lessonId: params.lessonId,
        title: params.title,
        passingScore: params.passingScore || 70,
        maxAttempts: params.maxAttempts || 3,
        timeLimitMinutes: params.timeLimitMinutes || 0,
        shuffleQuestions: params.shuffleQuestions || false,
        questionCount: 0,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// addQuizQuestion
// ---------------------------------------------------------------------------

export const addQuizQuestion: ToolDefinition = {
  name: "addQuizQuestion",
  description: "Add a question to a quiz",
  parameters: {
    type: "object",
    properties: {
      quizId: { type: "string", description: "Quiz ID" },
      questionText: { type: "string", description: "Question text" },
      type: { type: "string", description: "Question type", enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER", "MULTI_SELECT"] },
      options: { type: "array", items: { type: "string" }, description: "Answer options (for choice types)" },
      correctAnswer: { type: "string", description: "Correct answer or index" },
      points: { type: "number", description: "Point value" },
      explanation: { type: "string", description: "Explanation shown after answering" },
    },
    required: ["quizId", "questionText", "type", "correctAnswer"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `qq_${Date.now()}`,
        quizId: params.quizId,
        questionText: params.questionText,
        type: params.type,
        options: params.options || [],
        correctAnswer: params.correctAnswer,
        points: params.points || 1,
        explanation: params.explanation || null,
        orderIndex: 0,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// submitQuizAttempt
// ---------------------------------------------------------------------------

export const submitQuizAttempt: ToolDefinition = {
  name: "submitQuizAttempt",
  description: "Submit answers for a quiz attempt and get results",
  parameters: {
    type: "object",
    properties: {
      quizId: { type: "string", description: "Quiz ID" },
      userId: { type: "string", description: "User ID" },
      answers: { type: "array", items: { type: "object" }, description: "Array of {questionId, answer} objects" },
    },
    required: ["quizId", "userId", "answers"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    const totalQuestions = (params.answers as any[]).length || 5;
    const correctCount = Math.floor(totalQuestions * 0.8);
    const score = Math.round((correctCount / totalQuestions) * 100);
    return {
      success: true,
      data: {
        id: `attempt_${Date.now()}`,
        quizId: params.quizId,
        userId: params.userId,
        score,
        totalQuestions,
        correctCount,
        passed: score >= 70,
        attemptNumber: 1,
        timeSpentSeconds: 420,
        submittedAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getQuizResults
// ---------------------------------------------------------------------------

export const getQuizResults: ToolDefinition = {
  name: "getQuizResults",
  description: "Get quiz results and statistics for a quiz or user",
  parameters: {
    type: "object",
    properties: {
      quizId: { type: "string", description: "Quiz ID" },
      userId: { type: "string", description: "Filter by user" },
    },
    required: ["quizId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        quizId: params.quizId,
        quizTitle: "Security Training Assessment",
        totalAttempts: 45,
        averageScore: 82,
        passRate: 89,
        attempts: [
          { userId: "user_001", userName: "Sarah Chen", score: 92, passed: true, attemptNumber: 1, submittedAt: "2025-07-02T14:30:00Z" },
          { userId: "user_002", userName: "Mike Johnson", score: 68, passed: false, attemptNumber: 1, submittedAt: "2025-07-03T10:15:00Z" },
          { userId: "user_002", userName: "Mike Johnson", score: 84, passed: true, attemptNumber: 2, submittedAt: "2025-07-04T09:00:00Z" },
        ],
      },
    };
  },
};
