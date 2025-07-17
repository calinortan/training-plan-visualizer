import {
  parseISO,
  addDays,
  isToday,
  isBefore,
  isAfter,
  format,
} from "date-fns";

export function toDateSafe(val) {
  if (val instanceof Date && !isNaN(val)) return val;
  if (typeof val === "string") {
    const d = parseISO(val);
    if (!isNaN(d)) return d;
  }
  return null;
}

export function getDaysInWeek(startDate, _endDate) {
  const start = toDateSafe(startDate);
  if (!start) return [];
  // Always return 7 days starting from start
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export { isToday, isBefore, isAfter, format };
