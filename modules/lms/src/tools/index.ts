/**
 * LMS — Tool Barrel Export
 *
 * Aggregates all tools from course, lesson, enrollment, and quiz domain files.
 */

// Courses
export { createCourse, listCourses, updateCourse, publishCourse, archiveCourse } from "./courses";

// Lessons
export { createLesson, updateLesson, reorderLessons, addLessonContent } from "./lessons";

// Enrollment
export { enrollUser, getEnrollments, getProgress, issueCompletion } from "./enrollment";

// Quizzes
export { createQuiz, addQuizQuestion, submitQuizAttempt, getQuizResults } from "./quizzes";

// ---------------------------------------------------------------------------
// Aggregated imports for array + names
// ---------------------------------------------------------------------------

import { createCourse, listCourses, updateCourse, publishCourse, archiveCourse } from "./courses";
import { createLesson, updateLesson, reorderLessons, addLessonContent } from "./lessons";
import { enrollUser, getEnrollments, getProgress, issueCompletion } from "./enrollment";
import { createQuiz, addQuizQuestion, submitQuizAttempt, getQuizResults } from "./quizzes";

import type { ToolDefinition } from "../../../../sdk/types/index";

export const allLmsTools: ToolDefinition[] = [
  // Courses
  createCourse, listCourses, updateCourse, publishCourse, archiveCourse,
  // Lessons
  createLesson, updateLesson, reorderLessons, addLessonContent,
  // Enrollment
  enrollUser, getEnrollments, getProgress, issueCompletion,
  // Quizzes
  createQuiz, addQuizQuestion, submitQuizAttempt, getQuizResults,
];

export const LMS_TOOL_NAMES = allLmsTools.map((t) => t.name);

export const allToolNames = LMS_TOOL_NAMES;
