"use client";

const inputBase =
  "rounded-lg border px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 " +
  "dark:bg-zinc-700 dark:text-zinc-100 ";
const inputError =
  "border-red-400 focus:border-red-500 focus:ring-red-500 " +
  "dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400";
const inputOk =
  "border-zinc-300 focus:border-purple-500 focus:ring-purple-500 " +
  "dark:border-zinc-600 dark:focus:border-purple-400 dark:focus:ring-purple-400";

export interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  error: string | null;
  touched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export function DateField({
  id,
  label,
  value,
  error,
  touched,
  onChange,
  onBlur,
}: DateFieldProps) {
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
        type="date"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={inputClass}
        aria-invalid={!!hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {hasError && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
