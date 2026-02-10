"use client";

import type { Task, TaskPriority, TaskStatus } from "@/lib";
import { formatDueDate, isOverdue } from "@/lib";

const STATUS_LABELS: Record<Exclude<TaskStatus, "in_progress">, string> = {
  pending: "Activa",
  completed: "Completada",
};

const PRIORITY_STYLES: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  high: {
    label: "Alta",
    className:
      "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800",
  },
  medium: {
    label: "Media",
    className:
      "rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800",
  },
  low: {
    label: "Baja",
    className:
      "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800",
  },
};

export interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

/**
 * Renders a single task as a card with checkbox, state label and text.
 */
export function TaskItem({ task, onUpdateStatus, onDelete }: TaskItemProps) {
  const isCompleted = task.status === "completed";
  const dueLabel = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  const handleCheck = () => {
    onUpdateStatus(task.id, isCompleted ? "pending" : "completed");
  };

  return (
    <li className="rounded-xl border border-purple-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleCheck}
          className="mt-1 h-5 w-5 shrink-0 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
          aria-label={`Marcar ${task.title} como ${isCompleted ? "pendiente" : "completada"}`}
        />
        <div className="min-w-0 flex-1">
          <h3
            className={`break-words font-semibold text-zinc-800 ${isCompleted ? "line-through text-zinc-500" : ""}`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 break-words text-sm text-zinc-600">
              {task.description}
            </p>
          )}
          {dueLabel !== null && (
            <p
              className={`mt-1 text-xs ${overdue ? "font-medium text-red-600" : "text-zinc-500"}`}
            >
              Vence: {dueLabel}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className={PRIORITY_STYLES[task.priority].className}>
              {PRIORITY_STYLES[task.priority].label}
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              {task.status === "in_progress"
                ? "Activa"
                : STATUS_LABELS[task.status]}
            </span>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="ml-auto min-h-[44px] rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 sm:min-h-0 sm:py-1"
              aria-label={`Eliminar ${task.title}`}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
