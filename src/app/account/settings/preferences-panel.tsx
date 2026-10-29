"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { usePreferences } from "../../preference-runtime";
import {
  dateFormats,
  normalizePreferences,
  timezones,
  type StoredPreferences,
} from "../../../modules/m10/profile/preferences";
import { formatDateTime } from "../../../modules/m10/profile/format";

type Draft = {
  theme: StoredPreferences["theme"];
  timezone: string;
  dateFormat: StoredPreferences["date_format"];
  hourCycle: StoredPreferences["hour_cycle"];
  reducedMotion: StoredPreferences["reduced_motion"];
  fontScale: string;
};

const draftFrom = (value: StoredPreferences): Draft => ({
  theme: value.theme,
  timezone: value.timezone,
  dateFormat: value.date_format,
  hourCycle: value.hour_cycle,
  reducedMotion: value.reduced_motion,
  fontScale: value.font_scale,
});

const storedFrom = (value: Draft, version: string): StoredPreferences => ({
  theme: value.theme,
  language: "vi-VN",
  timezone: value.timezone,
  date_format: value.dateFormat,
  hour_cycle: value.hourCycle,
  reduced_motion: value.reducedMotion,
  font_scale: value.fontScale,
  version,
});

const previewDate = new Date("2026-01-02T17:05:00Z");

export default function PreferencesPanel() {
  const { applyPreferences } = usePreferences();
  const [saved, setSaved] = useState<StoredPreferences | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(true);
  const [expired, setExpired] = useState(false);
  const [failed, setFailed] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [message, setMessage] = useState("");
  const retry = useRef({ payload: "", commandId: "" });
  const savedRef = useRef<StoredPreferences | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    setMessage("");
    setFailed(false);
    setConflict(false);
    try {
      const response = await fetch("/api/profile/preferences", {
        cache: "no-store",
      });
      if (response.status === 401) {
        setExpired(true);
        setSaved(null);
        setDraft(null);
        return false;
      }
      if (!response.ok)
        throw new Error("Không thể tải cài đặt hiển thị. Hãy thử lại.");
      const data = await response.json();
      const next = normalizePreferences(data.preferences);
      savedRef.current = next;
      setSaved(next);
      setDraft(draftFrom(next));
      setExpired(false);
      applyPreferences(next);
      retry.current = { payload: "", commandId: "" };
      return true;
    } catch (error) {
      setFailed(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể kết nối. Hãy thử lại.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }, [applyPreferences]);

  useEffect(() => {
    void Promise.resolve().then(load);
    return () => {
      // Leaving without saving must not keep an unsaved preview.
      if (savedRef.current) applyPreferences(savedRef.current);
    };
  }, [load, applyPreferences]);

  function update(patch: Partial<Draft>) {
    if (!draft) return;
    const next = { ...draft, ...patch };
    setDraft(next);
    applyPreferences(
      normalizePreferences(storedFrom(next, saved?.version ?? "0")),
    );
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !saved || busy || conflict) return;
    const timezone = draft.timezone.trim();
    if (!timezone) {
      setFailed(true);
      setMessage("Hãy nhập múi giờ.");
      return;
    }
    const body = {
      version: Number(saved.version),
      theme: draft.theme,
      language: "vi-VN" as const,
      timezone,
      dateFormat: draft.dateFormat,
      hourCycle: draft.hourCycle,
      reducedMotion: draft.reducedMotion,
      fontScale: Number(Number(draft.fontScale).toFixed(2)),
    };
    const payload = JSON.stringify(body);
    if (retry.current.payload !== payload)
      retry.current = { payload, commandId: crypto.randomUUID() };
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch("/api/profile/preferences_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ ...body, commandId: retry.current.commandId }),
      });
      if (response.status === 401) {
        setExpired(true);
        setSaved(null);
        setDraft(null);
        return;
      }
      if (response.status === 409) {
        applyPreferences(saved);
        setConflict(true);
        setFailed(true);
        setMessage(
          "Cài đặt đã thay đổi ở một phiên khác. Tải lại và xem xét giá trị mới trước khi lưu.",
        );
        return;
      }
      if (response.status === 429) {
        setFailed(true);
        setMessage("Bạn thay đổi quá nhanh. Hãy chờ một lúc rồi thử lại.");
        return;
      }
      if (response.status === 400) {
        setFailed(true);
        setMessage(
          "Một giá trị chưa hợp lệ. Kiểm tra múi giờ và cỡ chữ rồi thử lại.",
        );
        return;
      }
      if (!response.ok) throw new Error();
      if (await load()) setMessage("Đã lưu cài đặt hiển thị.");
    } catch {
      setFailed(true);
      setMessage("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  const percent = draft ? `${Math.round(Number(draft.fontScale) * 100)}%` : "";
  const preview = draft
    ? formatDateTime(previewDate, {
        timezone: draft.timezone,
        date_format: draft.dateFormat,
        hour_cycle: draft.hourCycle,
      })
    : "";

  return (
    <section className="account-card preferences-panel" aria-busy={busy}>
      <h1>Cài đặt hiển thị</h1>
      <p className="intro">
        Cài đặt này chỉ đổi cách hiển thị cho tài khoản của bạn. Nội dung, ngày
        giờ gốc và dữ liệu chung không bị thay đổi.
      </p>
      {message && (
        <p
          className={failed ? "form-message form-error" : "form-message"}
          role={failed ? "alert" : "status"}
        >
          {message}
        </p>
      )}
      {expired ? (
        <Link href="/account">Đăng nhập lại</Link>
      ) : !saved || !draft ? (
        <p role="status">Đang tải cài đặt hiển thị…</p>
      ) : (
        <form className="account-form" onSubmit={save}>
          <fieldset disabled={busy || conflict}>
            <legend className="sr-only">Cài đặt hiển thị cá nhân</legend>
            <label className="field">
              Giao diện
              <select
                name="theme"
                value={draft.theme}
                onChange={(event) =>
                  update({
                    theme: event.target.value as Draft["theme"],
                  })
                }
              >
                <option value="system">Theo thiết bị</option>
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
              </select>
            </label>
            <p className="field-help">
              Ngôn ngữ: Tiếng Việt (vi-VN). Tiếng Anh thuộc phạm vi P1.
            </p>
            <label className="field">
              Múi giờ
              <input
                name="timezone"
                list="ourspace-timezones"
                value={draft.timezone}
                onChange={(event) => update({ timezone: event.target.value })}
                spellCheck={false}
                autoCapitalize="none"
                maxLength={100}
                required
              />
            </label>
            <datalist id="ourspace-timezones">
              {timezones.map((zone) => (
                <option key={zone} value={zone} />
              ))}
            </datalist>
            <label className="field">
              Định dạng ngày
              <select
                name="dateFormat"
                value={draft.dateFormat}
                onChange={(event) =>
                  update({
                    dateFormat: event.target.value as Draft["dateFormat"],
                  })
                }
              >
                {dateFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Định dạng giờ
              <select
                name="hourCycle"
                value={draft.hourCycle}
                onChange={(event) =>
                  update({
                    hourCycle: event.target.value as Draft["hourCycle"],
                  })
                }
              >
                <option value="h23">24 giờ (13:05)</option>
                <option value="h12">12 giờ (1:05 CH)</option>
              </select>
            </label>
            <label className="field">
              Chuyển động
              <select
                name="reducedMotion"
                value={draft.reducedMotion}
                onChange={(event) =>
                  update({
                    reducedMotion: event.target.value as Draft["reducedMotion"],
                  })
                }
              >
                <option value="system">Theo thiết bị</option>
                <option value="reduce">Giảm chuyển động</option>
              </select>
            </label>
            <label className="field">
              Cỡ chữ ({percent})
              <input
                name="fontScale"
                type="range"
                min={1}
                max={2}
                step={0.05}
                value={draft.fontScale}
                aria-valuetext={percent}
                onChange={(event) => update({ fontScale: event.target.value })}
              />
            </label>
            <p className="field-help">
              Xem trước:{" "}
              <time dateTime={previewDate.toISOString()}>{preview}</time> (
              {draft.timezone})
            </p>
          </fieldset>
          <div className="preference-actions">
            <button
              className="button primary"
              type="submit"
              disabled={busy || conflict}
            >
              {busy ? "Đang lưu…" : "Lưu cài đặt"}
            </button>
            <button
              className="button"
              type="button"
              disabled={busy}
              onClick={() => void load()}
            >
              Tải lại cài đặt
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
