"use client";

import { memo, useState, useRef, useEffect } from "react";
import type { Task, TaskPriority, TaskStatus } from "@/lib";
import { formatDueDate, isOverdue } from "@/lib";

export interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onUpdateTask: (id: string, newTitle: string, newDescription: string) => void;
}

const PRIORITY_STYLES: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  high: {
    label: "Alta",
    className:
      "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
  medium: {
    label: "Media",
    className:
      "rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  low: {
    label: "Baja",
    className:
      "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
};

/**
 * Componente de tarea editable mostrando título, descripción y estado.
 */
const EditableTaskItem = memo(function EditableTaskItem({
  task,
  onUpdateStatus,
  onDelete,
  onUpdateTask,
}: {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onUpdateTask: (id: string, newTitle: string, newDescription: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempDescription, setTempDescription] = useState(
    task.description ?? "",
  );
  const inputTitleRef = useRef<HTMLInputElement>(null);
  const dueLabel = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  useEffect(() => {
    if (!isEditing) {
      setTempTitle(task.title);
      setTempDescription(task.description ?? "");
    }
  }, [task.title, task.description, isEditing]);

  useEffect(() => {
    if (isEditing && inputTitleRef.current) {
      inputTitleRef.current.focus();
      inputTitleRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
    setTempTitle(task.title);
    setTempDescription(task.description ?? "");
  };

  const handleSave = () => {
    if (!tempTitle.trim()) return;
    onUpdateTask(task.id, tempTitle.trim(), tempDescription.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(task.title);
    setTempDescription(task.description ?? "");
    setIsEditing(false);
  };

  const StatusTag = () => (
    <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800 ml-0">
      {task.status === "completed" ? "Completada" : "Pendiente"}
    </span>
  );

  if (isEditing) {
    return (
      <li
        key={task.id}
        className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-3 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 sm:px-4"
      >
        <input
          ref={inputTitleRef}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[44px] dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:focus:ring-purple-500"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            } else if (e.key === "Escape") {
              handleCancel();
            }
          }}
          aria-label="Editar título tarea"
        />
        <textarea
          className="w-full border border-zinc-300 px-3 py-2 rounded text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:focus:ring-purple-500"
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          rows={2}
          aria-label="Editar descripción"
          placeholder="Escribe una descripción…"
        />

        <div className="mt-1 flex flex-wrap gap-2">
          <button
            className="min-h-[44px] rounded bg-purple-600 px-3 py-2 text-white hover:bg-purple-700 focus:outline-none disabled:opacity-60 dark:bg-purple-500 dark:hover:bg-purple-600 sm:py-1 sm:min-h-0"
            onClick={handleSave}
            disabled={!tempTitle.trim()}
            type="button"
          >
            Guardar
          </button>
          <button
            className="min-h-[44px] rounded bg-zinc-200 px-3 py-2 text-zinc-700 hover:bg-zinc-300 focus:outline-none dark:bg-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-500 sm:py-1 sm:min-h-0"
            onClick={handleCancel}
            type="button"
          >
            Cancelar
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={PRIORITY_STYLES[task.priority].className}>
            {PRIORITY_STYLES[task.priority].label}
          </span>
          <StatusTag />
        </div>
      </li>
    );
  }

  // Modo visualización mostrando título, descripción y estado como etiqueta
  return (
    <li
      key={task.id}
      className="group flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-3 shadow-sm transition-colors hover:bg-purple-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 sm:px-4"
      onClick={handleStartEdit}
      style={{ cursor: "pointer" }}
    >
      <div
        className="flex flex-row flex-wrap items-center gap-2 sm:gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={(e) => {
            e.stopPropagation();
            onUpdateStatus(
              task.id,
              task.status === "completed" ? "pending" : "completed",
            );
          }}
          className="h-5 w-5 shrink-0 cursor-pointer accent-purple-500 dark:accent-purple-400 sm:mr-1"
          aria-label={
            task.status === "completed"
              ? "Marcar como pendiente"
              : "Marcar como completada"
          }
        />
        <span
          className={`min-w-0 flex-1 break-words text-zinc-800 dark:text-zinc-200 ${
            task.status === "completed"
              ? "line-through text-zinc-400 dark:text-zinc-500"
              : ""
          }`}
        >
          {task.title}
        </span>
        <div className="flex w-full shrink-0 gap-1 sm:w-auto sm:flex-1 sm:justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartEdit();
            }}
            className="min-h-[44px] min-w-[44px] rounded border border-purple-200 bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-200 focus:outline-none dark:border-purple-700 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800 sm:min-h-0 sm:min-w-0 sm:py-1"
            aria-label="Actualizar tarea"
            type="button"
          >
            Actualizar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="min-h-[44px] min-w-[44px] rounded border bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 focus:outline-none dark:bg-red-500 dark:hover:bg-red-600 sm:min-h-0 sm:min-w-0 sm:py-1"
            aria-label="Eliminar tarea"
            type="button"
          >
            Eliminar
          </button>
        </div>
      </div>
      {task.description && (
        <p
          className={
            "break-words text-sm text-zinc-600 dark:text-zinc-400 sm:ml-8" +
            (task.status === "completed"
              ? " line-through dark:text-zinc-500"
              : "")
          }
        >
          {task.description}
        </p>
      )}
      {dueLabel !== null && (
        <p
          className={`mt-1 text-xs sm:ml-8 ${overdue ? "font-medium text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          Vence: {dueLabel}
        </p>
      )}
      <div className="mt-1 flex flex-wrap gap-2 sm:ml-8">
        <span className={PRIORITY_STYLES[task.priority].className}>
          {PRIORITY_STYLES[task.priority].label}
        </span>
        <StatusTag />
      </div>
    </li>
  );
});

export const TaskList = memo(function TaskList({
  tasks,
  onUpdateStatus,
  onDelete,
  onUpdateTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 py-8 text-center dark:border-purple-800 dark:bg-purple-950/30 sm:py-12">
        <p className="px-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          Aún no tienes tareas. Crea la primera desde el formulario de arriba.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 sm:gap-4" role="list">
      {tasks.map((task) => (
        <EditableTaskItem
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </ul>
  );
});
