// M10 D19,D22-D24 presentation contract shared by the client runtime and panels.
// These values only change display; canonical timestamps and Space data are never rewritten.
export type Theme = "light" | "dark" | "system";
export type DateFormat = "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd";
export type HourCycle = "h12" | "h23";
export type ReducedMotion = "system" | "reduce";
export type StoredPreferences = {
  theme: Theme;
  language: "vi-VN";
  timezone: string;
  date_format: DateFormat;
  hour_cycle: HourCycle;
  reduced_motion: ReducedMotion;
  font_scale: string;
  version: string;
};
export const defaultPreferences: StoredPreferences = {
  theme: "system",
  language: "vi-VN",
  timezone: "Asia/Ho_Chi_Minh",
  date_format: "dd/MM/yyyy",
  hour_cycle: "h23",
  reduced_motion: "system",
  font_scale: "1.00",
  version: "0",
};
export const dateFormats: DateFormat[] = [
  "dd/MM/yyyy",
  "MM/dd/yyyy",
  "yyyy-MM-dd",
];
export function normalizePreferences(value: unknown): StoredPreferences {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return defaultPreferences;
  const input = value as Record<string, unknown>;
  const theme = ["light", "dark", "system"].includes(input.theme as string)
    ? (input.theme as Theme)
    : defaultPreferences.theme;
  const dateFormat = dateFormats.includes(input.date_format as DateFormat)
    ? (input.date_format as DateFormat)
    : defaultPreferences.date_format;
  const hourCycle = ["h12", "h23"].includes(input.hour_cycle as string)
    ? (input.hour_cycle as HourCycle)
    : defaultPreferences.hour_cycle;
  const reducedMotion = ["system", "reduce"].includes(
    input.reduced_motion as string,
  )
    ? (input.reduced_motion as ReducedMotion)
    : defaultPreferences.reduced_motion;
  const fontScale = Number(input.font_scale);
  const scale =
    Number.isFinite(fontScale) && fontScale >= 1 && fontScale <= 2
      ? fontScale.toFixed(2)
      : defaultPreferences.font_scale;
  const timezone =
    typeof input.timezone === "string" &&
    input.timezone.length > 0 &&
    input.timezone.length <= 100
      ? input.timezone
      : defaultPreferences.timezone;
  const version =
    typeof input.version === "string" && /^[0-9]+$/.test(input.version)
      ? input.version
      : defaultPreferences.version;
  return {
    theme,
    language: "vi-VN",
    timezone,
    date_format: dateFormat,
    hour_cycle: hourCycle,
    reduced_motion: reducedMotion,
    font_scale: scale,
    version,
  };
}
export const timezones = [
  "Asia/Ho_Chi_Minh",
  "UTC",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
];
