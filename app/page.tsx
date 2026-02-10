"use client";

import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { generateId, type Task, type TaskStatus } from "@/lib";
import type { TaskFormValues } from "@/components/organisms/TaskForm";
import { TaskForm } from "@/components/organisms/TaskForm";
import { TaskList } from "@/components/organisms/TaskList";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

export type TaskFilter = "all" | "active" | "completed";

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "completed", label: "Completadas" },
];

/**
 * Main page: holds the list of tasks and exposes add, update, and delete.
 */
/** Filtra tareas por término de búsqueda (título y descripción, sin distinguir mayúsculas). */
function filterBySearch(tasks: Task[], query: string): Task[] {
  const term = query.trim().toLowerCase();
  if (!term) return tasks;
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term)),
  );
}

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("task-manager-tasks", []);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { showToast } = useToast();

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (activeFilter === "active") {
      result = result.filter((t) => t.status !== "completed");
    } else if (activeFilter === "completed") {
      result = result.filter((t) => t.status === "completed");
    }
    return filterBySearch(result, debouncedSearch);
  }, [tasks, activeFilter, debouncedSearch]);

  const addTask = useCallback(
    (values: TaskFormValues & { status: TaskStatus }) => {
      setTasks((prev) => [
        ...prev,
        {
          id: generateId(),
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          status: values.status,
          priority: values.priority,
        },
      ]);
      showToast(
        "Tarea creada",
        `"${values.title}" se agregó correctamente.`,
        "success",
      );
    },
    [setTasks, showToast],
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  }, []);

  const updateStatus = useCallback(
    (id: string, status: TaskStatus) => {
      updateTask(id, { status });
      const label = status === "completed" ? "completada" : "pendiente";
      showToast("Estado actualizado", `Tarea marcada como ${label}.`, "info");
    },
    [updateTask, showToast],
  );

  const handleUpdateTask = useCallback(
    (id: string, newTitle: string, newDescription: string) => {
      updateTask(id, {
        title: newTitle,
        description: newDescription,
      });
      showToast(
        "Tarea actualizada",
        `"${newTitle}" se guardó correctamente.`,
        "success",
      );
    },
    [updateTask, showToast],
  );

  const deleteTask = useCallback(
    // Eliminada la clase min-w de <h1>; asegúrate de ajustar la clase del header, no este callback.
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      const confirmed = window.confirm(
        "¿Estás seguro de que deseas eliminar esta tarea?",
      );
      if (!confirmed) return;
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast(
        "Tarea eliminada",
        task ? `"${task.title}" fue eliminada.` : "La tarea fue eliminada.",
        "error",
      );
    },
    [tasks, setTasks, showToast],
  );

  return (
    <div className="min-h-screen min-h-[100dvh] w-full overflow-x-hidden bg-white dark:bg-zinc-900">
      <header className="w-full bg-purple-600 px-3 py-3 shadow-md dark:bg-purple-800 sm:px-6 sm:py-5">
        <div className="mx-auto flex max-w-2xl items-center gap-2 sm:gap-4">
          <h1 className="flex min-w-0 flex-1 items-center justify-center gap-1.5 text-base font-bold text-white sm:gap-2 sm:text-2xl">
            <span aria-hidden className="shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:h-7 sm:w-7"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </span>
            Mis tareas
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="mb-8 sm:mb-10">
          <TaskForm onSubmit={addTask} />
        </section>

        <section>
          <h2 className="mb-4 text-base font-semibold text-purple-700 dark:text-purple-300 sm:text-lg">
            Lista de tareas
          </h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveFilter(value)}
                className={
                  activeFilter === value
                    ? "rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm dark:bg-purple-500"
                    : "rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }
                aria-pressed={activeFilter === value}
                aria-label={`Filtrar: ${label}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label htmlFor="search-tasks" className="sr-only">
              Buscar tareas por título o descripción
            </label>
            <input
              id="search-tasks"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-purple-400 dark:focus:ring-purple-400"
              aria-label="Buscar tareas"
            />
          </div>
          <TaskList
            tasks={filteredTasks}
            onUpdateStatus={updateStatus}
            onDelete={deleteTask}
            onUpdateTask={handleUpdateTask}
          />
        </section>
      </main>
    </div>
  );
}
