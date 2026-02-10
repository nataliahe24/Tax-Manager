"use client";

const inputBase =
  "rounded-lg border px-3 py-2 text-zinc-900 placeholder:text-zinc-400 " +
  "focus:outline-none focus:ring-1 dark:bg-zinc-700 dark:text-zinc-100 " +
  "dark:placeholder:text-zinc-500 ";
const inputError =
  "border-red-400 focus:border-red-500 focus:ring-red-500 " +
  "dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400";
const inputOk =
  "border-zinc-300 focus:border-purple-500 focus:ring-purple-500 " +
  "dark:border-zinc-600 dark:focus:border-purple-400 dark:focus:ring-purple-400";

export interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  error: string | null;
  touched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder?: string;
  maxLength?: number;
  counter?: string;
}

export function TextField({
  id,
  label,
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
  maxLength,
  counter,
}: TextFieldProps) {
  const hasError = touched && error;
  const inputClass = `${inputBase}${hasError ? inputError : inputOk}`;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={inputClass}
        aria-invalid={!!hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      <div className="flex items-center justify-between">
        {hasError ? (
          <p
            id={`${id}-error`}
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        ) : (
          <span />
        )}
        {counter !== undefined && (
          <span
            className={`text-xs ${
              value.trim().length > (maxLength ?? 0)
                ? "text-red-500 dark:text-red-400"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {counter}
          </span>
        )}
      </div>
    </div>
  );
}
