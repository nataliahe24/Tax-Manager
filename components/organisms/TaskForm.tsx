"use client";

import { memo } from "react";
import type { TaskStatus } from "@/lib";
import { useTaskFormValidation } from "@/hooks/useTaskFormValidation";
import type { TaskFormValues } from "@/hooks/useTaskFormValidation";
import {
  TextField,
  TextAreaField,
  DateField,
  SelectField,
} from "@/components/atoms";

const MAX_TITLE = 100;
const MAX_DESC = 100;

const PRIORITY_OPTIONS = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Media" },
  { value: "low", label: "Baja" },
];

export type { TaskFormValues };

export interface TaskFormProps {
  /** Called when the user submits a valid form. */
  onSubmit: (values: TaskFormValues & { status: TaskStatus }) => void;
}

/**
 * Organism: composes atoms (TextField, TextAreaField, DateField, SelectField)
 * and useTaskFormValidation to create the new-task form.
 */
export const TaskForm = memo(function TaskForm({ onSubmit }: TaskFormProps) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useTaskFormValidation();

  const onSubmitForm = (e: React.FormEvent) => {
    const payload = handleSubmit(e);
    if (payload) onSubmit(payload);
  };

  return (
    <form
      onSubmit={onSubmitForm}
      className={
        "flex flex-col gap-4 rounded-xl border border-purple-100 bg-white " +
        "p-4 shadow-sm dark:border-purple-900/50 dark:bg-zinc-800 sm:p-6"
      }
    >
      <h2 className="text-base font-semibold text-purple-800 dark:text-purple-200 sm:text-lg">
        Nueva tarea
      </h2>

      <TextField
        id="task-title"
        label="Título *"
        value={values.title}
        error={errors.title}
        touched={touched.title}
        onChange={handleChange("title")}
        onBlur={handleBlur("title")}
        placeholder="Ej: Revisar informe"
        maxLength={MAX_TITLE}
        counter={`${values.title.trim().length}/${MAX_TITLE}`}
      />

      <TextAreaField
        id="task-desc"
        label="Descripción"
        value={values.description}
        error={errors.description}
        touched={touched.description}
        onChange={handleChange("description")}
        onBlur={handleBlur("description")}
        placeholder="Detalles opcionales"
        rows={3}
        maxLength={MAX_DESC}
        counter={`${values.description.trim().length}/${MAX_DESC}`}
      />

      <DateField
        id="task-due"
        label="Fecha de vencimiento *"
        value={values.dueDate}
        error={errors.dueDate}
        touched={touched.dueDate}
        onChange={handleChange("dueDate")}
        onBlur={handleBlur("dueDate")}
      />

      <SelectField
        id="task-priority"
        label="Prioridad *"
        value={values.priority}
        error={errors.priority}
        touched={touched.priority}
        onChange={handleChange("priority")}
        onBlur={handleBlur("priority")}
        options={PRIORITY_OPTIONS}
        placeholder="Selecciona una prioridad"
        ariaLabel="Prioridad de la tarea"
      />

      <button
        type="submit"
        className={
          "mt-2 min-h-[44px] rounded-lg bg-purple-600 px-4 py-3 " +
          "font-medium text-white transition-colors hover:bg-purple-700 " +
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 " +
          "dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-400 " +
          "dark:focus:ring-offset-zinc-800 sm:py-2"
        }
      >
        Agregar tarea
      </button>
    </form>
  );
});
