/**
 * Task status values for the task manager.
 */
export type TaskStatus = "pending" | "in_progress" | "completed";

/**
 * Task priority levels.
 */
export type TaskPriority = "high" | "medium" | "low";

/**
 * Task entity with unique id and optional fields.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
}
