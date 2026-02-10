/**
 * Utility functions for the task manager app.
 */

export type { Task, TaskPriority, TaskStatus } from "./types";
export { formatDueDate, isOverdue } from "./date-utils";

/**
 * Generates a unique id for new tasks (time-based + random suffix).
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
