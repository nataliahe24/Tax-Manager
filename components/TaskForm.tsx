"use client";

import { memo, useState, useCallback } from "react";
import type { TaskPriority, TaskStatus } from "@/lib";

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}

export interface TaskFormProps {
  /** Called when the user submits a valid form. */
  onSubmit: (values: TaskFormValues & { status: TaskStatus }) => void;
}

const INITIAL: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "" as TaskPriority,
};

const MAX_TITLE = 100;
const MAX_DESC = 100;

type FieldErrors = {
  title: string | null;
  description: string | null;
  dueDate: string | null;
  priority: string | null;
};

type TouchedFields = {
  title: boolean;
  description: boolean;
  dueDate: boolean;
  priority: boolean;
};

const EMPTY_ERRORS: FieldErrors = {
  title: null,
  description: null,
  dueDate: null,
  priority: null,
};

const UNTOUCHED: TouchedFields = {
  title: false,
  description: false,
  dueDate: false,
  priority: false,
};

function validateTitle(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "El título es obligatorio.";
  if (trimmed.length > MAX_TITLE) {
    return `Máximo ${MAX_TITLE} caracteres.`;
  }
  return null;
}

function validateDescription(value: string): string | null {
  if (value.trim().length > MAX_DESC) {
    return `Máximo ${MAX_DESC} caracteres.`;
  }
  return null;
}

function validateDueDate(value: string): string | null {
  if (!value) return "La fecha es obligatoria.";
  return null;
}

function validatePriority(value: string): string | null {
  if (!value) return "La prioridad es obligatoria.";
  return null;
}

/**
 * Form to create a new task. Validates required title and clears inputs
 * after a successful submit.
 */
export const TaskForm = memo(function TaskForm({ onSubmit }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [touched, setTouched] = useState<TouchedFields>(UNTOUCHED);

  const validateField = useCallback(
    (field: keyof TaskFormValues, val: string) => {
      const validators: Record<
        keyof TaskFormValues,
        (v: string) => string | null
      > = {
        title: validateTitle,
        description: validateDescription,
        dueDate: validateDueDate,
        priority: validatePriority,
      };
      return validators[field](val);
    },
    [],
  );

  const handleChange = useCallback(
    (field: keyof TaskFormValues) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const raw = e.target.value;
        const value = field === "priority" ? (raw as TaskPriority) : raw;
        setValues((prev) => ({
          ...prev,
          [field]: value,
        }));
        setErrors((prev) => ({
          ...prev,
          [field]: validateField(field, raw),
        }));
      },
    [validateField],
  );

  const handleBlur = useCallback(
    (field: keyof TaskFormValues) => () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
      setValues((curr) => {
        setErrors((prev) => ({
          ...prev,
          [field]: validateField(field, curr[field]),
        }));
        return curr;
      });
    },
    [validateField],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: FieldErrors = {
        title: validateTitle(values.title),
        description: validateDescription(values.description),
        dueDate: validateDueDate(values.dueDate),
        priority: validatePriority(values.priority),
      };
      setErrors(newErrors);
      setTouched({
        title: true,
        description: true,
        dueDate: true,
        priority: true,
      });

      const hasError = Object.values(newErrors).some(Boolean);
      if (hasError) return;

      onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: values.dueDate,
        priority: values.priority,
        status: "pending",
      });
      setValues(INITIAL);
      setErrors(EMPTY_ERRORS);
      setTouched(UNTOUCHED);
    },
    [values, onSubmit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-purple-100 bg-white p-4 shadow-sm dark:border-purple-900/50 dark:bg-zinc-800 sm:p-6"
    >
      <h2 className="text-base font-semibold text-purple-800 dark:text-purple-200 sm:text-lg">
        Nueva tarea
      </h2>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="task-title"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          Título *
        </label>
        <input
          id="task-title"
          type="text"
          value={values.title}
          onChange={handleChange("title")}
          onBlur={handleBlur("title")}
          placeholder="Ej: Revisar informe"
          maxLength={MAX_TITLE}
          className={`rounded-lg border px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${
            touched.title && errors.title
              ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400"
              : "border-zinc-300 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:focus:border-purple-400 dark:focus:ring-purple-400"
          }`}
          aria-invalid={!!(touched.title && errors.title)}
          aria-describedby={
            touched.title && errors.title ? "title-error" : undefined
          }
        />
        <div className="flex items-center justify-between">
          {touched.title && errors.title ? (
            <p
              id="title-error"
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {errors.title}
            </p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ${
              values.title.trim().length > MAX_TITLE
                ? "text-red-500 dark:text-red-400"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {values.title.trim().length}/{MAX_TITLE}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="task-desc"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          Descripción
        </label>
        <textarea
          id="task-desc"
          value={values.description}
          onChange={handleChange("description")}
          onBlur={handleBlur("description")}
          placeholder="Detalles opcionales"
          rows={3}
          maxLength={MAX_DESC}
          className={`rounded-lg border px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${
            touched.description && errors.description
              ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400"
              : "border-zinc-300 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:focus:border-purple-400 dark:focus:ring-purple-400"
          }`}
          aria-invalid={!!(touched.description && errors.description)}
          aria-describedby={
            touched.description && errors.description ? "desc-error" : undefined
          }
        />
        <div className="flex items-center justify-between">
          {touched.description && errors.description ? (
            <p
              id="desc-error"
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {errors.description}
            </p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ${
              values.description.trim().length > MAX_DESC
                ? "text-red-500 dark:text-red-400"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {values.description.trim().length}/{MAX_DESC}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="task-due"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          Fecha de vencimiento *
        </label>
        <input
          id="task-due"
          type="date"
          value={values.dueDate}
          onChange={handleChange("dueDate")}
          onBlur={handleBlur("dueDate")}
          className={`rounded-lg border px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 dark:bg-zinc-700 dark:text-zinc-100 ${
            touched.dueDate && errors.dueDate
              ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400"
              : "border-zinc-300 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:focus:border-purple-400 dark:focus:ring-purple-400"
          }`}
          aria-invalid={!!(touched.dueDate && errors.dueDate)}
          aria-describedby={
            touched.dueDate && errors.dueDate ? "due-error" : undefined
          }
        />
        {touched.dueDate && errors.dueDate && (
          <p
            id="due-error"
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.dueDate}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="task-priority"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          Prioridad *
        </label>
        <select
          id="task-priority"
          value={values.priority}
          onChange={handleChange("priority")}
          onBlur={handleBlur("priority")}
          className={`rounded-lg border px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 dark:bg-zinc-700 dark:text-zinc-100 ${
            touched.priority && errors.priority
              ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400"
              : "border-zinc-300 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:focus:border-purple-400 dark:focus:ring-purple-400"
          }`}
          aria-label="Prioridad de la tarea"
          aria-invalid={!!(touched.priority && errors.priority)}
          aria-describedby={
            touched.priority && errors.priority ? "priority-error" : undefined
          }
        >
          <option value="" disabled>
            Selecciona una prioridad
          </option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
        {touched.priority && errors.priority && (
          <p
            id="priority-error"
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.priority}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-2 min-h-[44px] rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-400 dark:focus:ring-offset-zinc-800 sm:py-2"
      >
        Agregar tarea
      </button>
    </form>
  );
});
