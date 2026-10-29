import type { DateFormat, HourCycle } from "./preferences";

export type DisplayFormat = {
  timezone: string;
  date_format: DateFormat;
  hour_cycle: HourCycle;
};

const pad = (value: string | undefined) => (value ?? "").padStart(2, "0");

// Display-only formatting: the stored instant is passed through unchanged.
export function formatDate(
  value: string | number | Date,
  format: DisplayFormat,
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  try {
    const parts = new Intl.DateTimeFormat("vi-VN", {
      timeZone: format.timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      pad(parts.find((item) => item.type === type)?.value);
    const day = part("day");
    const month = part("month");
    const year = parts.find((item) => item.type === "year")?.value ?? "";
    return format.date_format === "yyyy-MM-dd"
      ? `${year}-${month}-${day}`
      : format.date_format === "MM/dd/yyyy"
        ? `${month}/${day}/${year}`
        : `${day}/${month}/${year}`;
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function formatDateTime(
  value: string | number | Date,
  format: DisplayFormat,
): string {
  const date = new Date(value);
  const day = formatDate(date, format);
  if (!day) return "";
  try {
    const time = new Intl.DateTimeFormat("vi-VN", {
      timeZone: format.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: format.hour_cycle,
    }).format(date);
    return `${day} ${time}`;
  } catch {
    return day;
  }
}
