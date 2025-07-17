import {
  parseISO,
  addDays,
  isToday,
  isBefore,
  isAfter,
  format,
} from "date-fns";

export function toDateSafe(val: Date | string | undefined | null): Date | null {
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  if (typeof val === "string") {
    const d = parseISO(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

export function getDaysInWeek(
  startDate: Date | string | undefined | null,
  _endDate?: Date | string
): Date[] {
  const start = toDateSafe(startDate);
  if (!start) return [];
  // Always return 7 days starting from start
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export { isToday, isBefore, isAfter, format };
