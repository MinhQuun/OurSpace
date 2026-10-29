"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";

type NotificationItem = {
  id: string;
  notification_type: string;
  space_id: string | null;
  source_module: string | null;
  source_id: string | null;
  title_key: string | null;
  body_key: string | null;
  link_href: string | null;
  priority: string;
  is_essential: boolean;
  read_at: string | null;
  created_at: string;
};

type Preferences = {
  version: string;
  enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_start_minutes: number;
  quiet_end_minutes: number;
  type_preferences: Record<string, boolean>;
};

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const notificationTypes = [
  { key: "pairing", label: "Ghép đôi" },
  { key: "space", label: "Không gian chung" },
  { key: "profile", label: "Hồ sơ" },
  { key: "security", label: "Bảo mật" },
  { key: "system", label: "Hệ thống" },
];

export default function NotificationsPanel() {
  const [tab, setTab] = useState<"center" | "preferences">("center");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [draft, setDraft] = useState<Preferences | null>(null);
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [conflict, setConflict] = useState(false);
  const retry = useRef({ payload: "", commandId: "" });

  const loadList = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/list?limit=50", {
        cache: "no-store",
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (!response.ok) throw new Error();
      const data = await response.json();
      setNotifications(data.notifications ?? []);
    } catch {
      setFailed(true);
      setMessage("Không thể tải thông báo.");
    }
  }, []);

  const loadCount = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/count", {
        cache: "no-store",
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (!response.ok) throw new Error();
      const data = await response.json();
      setUnread(data.unread ?? 0);
    } catch {
      // ignore count errors
    }
  }, []);

  const loadPrefs = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/preferences", {
        cache: "no-store",
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPrefs(data.preferences);
      setDraft(data.preferences);
    } catch {
      setFailed(true);
      setMessage("Không thể tải cài đặt thông báo.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setBusy(true);
      setMessage("");
      setFailed(false);
      setConflict(false);
      await Promise.all([loadList(), loadCount(), loadPrefs()]);
      if (active) setBusy(false);
    };
    void run();
    return () => {
      active = false;
    };
  }, [loadList, loadCount, loadPrefs]);

  async function markRead(id: string) {
    try {
      const response = await fetch("/api/notifications/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ notificationId: id }),
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (response.ok) {
        setNotifications((items) =>
          items.map((item) =>
            item.id === id
              ? { ...item, read_at: new Date().toISOString() }
              : item,
          ),
        );
        void loadCount();
      }
    } catch {
      // ignore
    }
  }

  async function markAllRead() {
    try {
      const response = await fetch("/api/notifications/read_all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({}),
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (response.ok) {
        setNotifications((items) =>
          items.map((item) => ({
            ...item,
            read_at: item.read_at ?? new Date().toISOString(),
          })),
        );
        setUnread(0);
      }
    } catch {
      // ignore
    }
  }

  async function hide(id: string) {
    try {
      const response = await fetch("/api/notifications/hide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ notificationId: id }),
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (response.ok) {
        setNotifications((items) => items.filter((item) => item.id !== id));
        void loadCount();
      }
    } catch {
      // ignore
    }
  }

  function updatePref(patch: Partial<Preferences>) {
    if (!draft) return;
    setDraft({ ...draft, ...patch });
  }

  function toggleType(key: string) {
    if (!draft) return;
    setDraft({
      ...draft,
      type_preferences: {
        ...(draft.type_preferences ?? {}),
        [key]: !(draft.type_preferences?.[key] ?? true),
      },
    });
  }

  async function savePrefs(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !prefs || busy || conflict) return;
    const body = {
      version: Number(draft.version),
      enabled: draft.enabled,
      quietHoursEnabled: draft.quiet_hours_enabled,
      quietStartMinutes: Number(draft.quiet_start_minutes),
      quietEndMinutes: Number(draft.quiet_end_minutes),
      typePreferences: draft.type_preferences ?? {},
    };
    const payload = JSON.stringify(body);
    if (retry.current.payload !== payload)
      retry.current = { payload, commandId: crypto.randomUUID() };
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch("/api/notifications/preferences_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ ...body, commandId: retry.current.commandId }),
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (response.status === 409) {
        setConflict(true);
        setFailed(true);
        setMessage("Cài đặt đã thay đổi ở phiên khác. Tải lại trước khi lưu.");
        return;
      }
      if (response.status === 429) {
        setFailed(true);
        setMessage("Thay đổi quá nhanh. Hãy thử lại sau.");
        return;
      }
      if (response.status === 400) {
        setFailed(true);
        setMessage("Giá trị không hợp lệ. Kiểm tra lại thời gian và thử lại.");
        return;
      }
      if (!response.ok) throw new Error();
      await loadPrefs();
      setMessage("Đã lưu cài đặt thông báo.");
      setConflict(false);
    } catch {
      setFailed(true);
      setMessage("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="account-card" aria-busy={busy}>
      <h1>Thông báo</h1>
      <p className="intro">
        Trung tâm thông báo trong ứng dụng, cài đặt theo loại và Quiet Hours.
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
      ) : (
        <>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className={tab === "center" ? "button primary" : "button"}
              onClick={() => setTab("center")}
            >
              Trung tâm thông báo {unread > 0 ? `(${unread})` : ""}
            </button>
            <button
              type="button"
              className={tab === "preferences" ? "button primary" : "button"}
              onClick={() => setTab("preferences")}
            >
              Tùy chọn và Quiet Hours
            </button>
          </div>
          {tab === "center" && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  className="button"
                  onClick={() => void markAllRead()}
                  disabled={busy || unread === 0}
                >
                  Đánh dấu tất cả đã đọc
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    void loadList();
                    void loadCount();
                  }}
                  disabled={busy}
                >
                  Tải lại
                </button>
              </div>
              {notifications.length === 0 ? (
                <p role="status" style={{ marginTop: "1rem" }}>
                  Không có thông báo.
                </p>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    marginTop: "1rem",
                    display: "grid",
                    gap: "0.75rem",
                  }}
                >
                  {notifications.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <strong>
                            {item.title_key || item.notification_type}
                          </strong>
                          {item.is_essential && (
                            <span> • Bảo mật thiết yếu</span>
                          )}
                          {!item.read_at && <span> • Chưa đọc</span>}
                          <p style={{ margin: "0.25rem 0 0 0", opacity: 0.8 }}>
                            {item.body_key || "Không có nội dung xem trước."}
                          </p>
                          <p
                            style={{
                              margin: "0.25rem 0 0 0",
                              fontSize: "0.875rem",
                              opacity: 0.7,
                            }}
                          >
                            {new Date(item.created_at).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                          }}
                        >
                          {!item.read_at && (
                            <button
                              type="button"
                              className="button"
                              onClick={() => void markRead(item.id)}
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                          {item.link_href && (
                            <Link
                              className="button"
                              href={item.link_href}
                              onClick={() => void markRead(item.id)}
                            >
                              Mở
                            </Link>
                          )}
                          <button
                            type="button"
                            className="button"
                            onClick={() => void hide(item.id)}
                          >
                            Ẩn
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {tab === "preferences" && draft && (
            <form
              className="account-form"
              onSubmit={savePrefs}
              style={{ marginTop: "1rem" }}
            >
              <fieldset disabled={busy || conflict}>
                <legend className="sr-only">Tùy chọn thông báo</legend>
                <label className="field">
                  Nhận thông báo
                  <select
                    value={draft.enabled ? "on" : "off"}
                    onChange={(event) =>
                      updatePref({ enabled: event.target.value === "on" })
                    }
                  >
                    <option value="on">Bật</option>
                    <option value="off">Tắt</option>
                  </select>
                </label>
                <p className="field-help">
                  Thông báo bảo mật thiết yếu có chính sách riêng và không bị vô
                  hiệu hóa thiếu an toàn.
                </p>
                <fieldset
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                  }}
                >
                  <legend>Quiet Hours</legend>
                  <label className="field">
                    Bật Quiet Hours
                    <select
                      value={draft.quiet_hours_enabled ? "on" : "off"}
                      onChange={(event) =>
                        updatePref({
                          quiet_hours_enabled: event.target.value === "on",
                        })
                      }
                    >
                      <option value="off">Tắt</option>
                      <option value="on">Bật</option>
                    </select>
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    <label className="field">
                      Bắt đầu
                      <input
                        type="time"
                        value={formatTime(draft.quiet_start_minutes)}
                        onChange={(event) => {
                          const [h, m] = event.target.value
                            .split(":")
                            .map(Number);
                          updatePref({ quiet_start_minutes: h * 60 + m });
                        }}
                      />
                    </label>
                    <label className="field">
                      Kết thúc
                      <input
                        type="time"
                        value={formatTime(draft.quiet_end_minutes)}
                        onChange={(event) => {
                          const [h, m] = event.target.value
                            .split(":")
                            .map(Number);
                          updatePref({ quiet_end_minutes: h * 60 + m });
                        }}
                      />
                    </label>
                  </div>
                  <p className="field-help">
                    Quiet Hours chỉ điều chỉnh việc thông báo, không tự hoãn
                    trạng thái nghiệp vụ.
                  </p>
                </fieldset>
                <fieldset
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                  }}
                >
                  <legend>Loại thông báo không bắt buộc</legend>
                  {notificationTypes.map((type) => (
                    <label
                      key={type.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={draft.type_preferences?.[type.key] ?? true}
                        onChange={() => toggleType(type.key)}
                      />
                      {type.label}
                    </label>
                  ))}
                </fieldset>
              </fieldset>
              <div className="preference-actions">
                <button
                  className="button primary"
                  type="submit"
                  disabled={busy || conflict}
                >
                  {busy ? "Đang lưu…" : "Lưu tùy chọn"}
                </button>
                <button
                  className="button"
                  type="button"
                  disabled={busy}
                  onClick={() => void loadPrefs()}
                >
                  Tải lại
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}
