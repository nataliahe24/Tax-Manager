/**
 * Returns the start of the given date in local time (midnight).
 */
function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

/**
 * Formats a due date string as "Hoy", "Mañana", "En X días", or "Vencida".
 * Returns null for empty or invalid dates.
 */
export function formatDueDate(dueDate: string): string | null {
  const trimmed = dueDate?.trim();
  if (!trimmed) return null;

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;

  const today = startOfDay(new Date());
  const due = startOfDay(date);
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays < 0) return "Vencida";
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  return `En ${diffDays} días`;
}

/**
 * True when the due date is in the past (before today). False for empty.
 */
export function isOverdue(dueDate: string): boolean {
  const trimmed = dueDate?.trim();
  if (!trimmed) return false;

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return false;

  const today = startOfDay(new Date());
  const due = startOfDay(date);
  return due.getTime() < today.getTime();
}
