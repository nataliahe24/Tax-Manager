"use client";

import { useState, useCallback } from "react";
import type { TaskPriority, TaskStatus } from "@/lib";

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}

export type TaskFormField = keyof TaskFormValues;

export type FieldErrors = {
  title: string | null;
  description: string | null;
  dueDate: string | null;
  priority: string | null;
};

export type TouchedFields = {
  title: boolean;
  description: boolean;
  dueDate: boolean;
  priority: boolean;
};

const MAX_TITLE = 100;
const MAX_DESC = 100;

const INITIAL: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "" as TaskPriority,
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
  if (trimmed.length > MAX_TITLE) return `Máximo ${MAX_TITLE} caracteres.`;
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

const validators: Record<TaskFormField, (v: string) => string | null> = {
  title: validateTitle,
  description: validateDescription,
  dueDate: validateDueDate,
  priority: validatePriority,
};

export interface UseTaskFormValidationReturn {
  values: TaskFormValues;
  errors: FieldErrors;
  touched: TouchedFields;
  handleChange: (
    field: TaskFormField,
  ) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleBlur: (field: TaskFormField) => () => void;
  handleSubmit: (
    e: React.FormEvent,
  ) => (TaskFormValues & { status: TaskStatus }) | null;
}

/**
 * Encapsulates task form state, validation and handlers.
 * handleSubmit returns payload on valid submit (and resets form), null otherwise.
 */
export function useTaskFormValidation(): UseTaskFormValidationReturn {
  const [values, setValues] = useState<TaskFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [touched, setTouched] = useState<TouchedFields>(UNTOUCHED);

  const handleChange = useCallback((field: TaskFormField) => {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const raw = e.target.value;
      const value = field === "priority" ? (raw as TaskPriority) : raw;
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](raw),
      }));
    };
  }, []);

  const handleBlur = useCallback((field: TaskFormField) => {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setValues((curr) => {
        setErrors((prev) => ({
          ...prev,
          [field]: validators[field](curr[field]),
        }));
        return curr;
      });
    };
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent): (TaskFormValues & { status: TaskStatus }) | null => {
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
      if (hasError) return null;
      const payload: TaskFormValues & { status: TaskStatus } = {
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: values.dueDate,
        priority: values.priority,
        status: "pending",
      };
      setValues(INITIAL);
      setErrors(EMPTY_ERRORS);
      setTouched(UNTOUCHED);
      return payload;
    },
    [values],
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
