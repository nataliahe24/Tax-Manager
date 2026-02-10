/**
 * Centralized priority label and CSS for task badges.
 */
import type { TaskPriority } from "./types";

export const PRIORITY_STYLES: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  high: {
    label: "Alta",
    className:
      "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 " +
      "dark:bg-red-900/40 dark:text-red-300",
  },
  medium: {
    label: "Media",
    className:
      "rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium " +
      "text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  low: {
    label: "Baja",
    className:
      "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 " +
      "dark:bg-green-900/40 dark:text-green-300",
  },
};
