"use client";

import { useCallback, useEffect, useState } from "react";

type Session = {
  id: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
  is_current: boolean;
  last_seen: string;
};

export default function SessionPanel({ onExpired }: { onExpired: () => void }) {
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [now, setNow] = useState(0);

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      const response = await fetch("/api/auth/sessions", {
        cache: "no-store",
        signal,
      });
      if (response.status === 401) {
        onExpired();
        return;
      }
      if (!response.ok) throw new Error();
      setItems((await response.json()).sessions);
      setNow(Date.now());
      setLoading(false);
    },
    [onExpired],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/sessions", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          onExpired();
          return;
        }
        if (!response.ok) throw new Error();
        setItems((await response.json()).sessions);
        setNow(Date.now());
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          setError(true);
          setMessage("Chưa thể tải danh sách phiên. Hãy thử làm mới.");
        }
      });
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [onExpired]);

  async function action(session?: Session) {
    if (
      busy ||
      !window.confirm(
        session?.is_current
          ? "Đăng xuất phiên hiện tại?"
          : session
            ? "Thu hồi phiên đã chọn?"
            : "Đăng xuất tất cả phiên khác?",
      )
    )
      return;
    setBusy(true);
    setError(false);
    setMessage("");
    try {
      const response = await fetch(
        `/api/auth/${session ? "revoke-session" : "revoke-other-sessions"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(session ? { sessionId: session.id } : {}),
        },
      );
      if (response.status === 401 || (response.ok && session?.is_current)) {
        onExpired();
        return;
      }
      if (!response.ok) throw new Error();
      await refresh();
      setMessage(
        session
          ? "Đã cập nhật phiên được chọn."
          : "Đã đăng xuất các phiên khác.",
      );
    } catch {
      setError(true);
      setMessage("Chưa thể cập nhật phiên. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="session-panel"
      aria-labelledby="sessions-heading"
      aria-busy={busy || loading}
    >
      <h2 id="sessions-heading">Phiên đăng nhập</h2>
      <p className="field-help">
        Chỉ tài khoản của bạn có thể xem và thu hồi các phiên này.
      </p>
      {message && <p role={error ? "alert" : "status"}>{message}</p>}
      <div className="session-actions">
        <button
          type="button"
          disabled={busy || loading}
          onClick={() => action()}
        >
          Đăng xuất các phiên khác
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(false);
            setMessage("");
            try {
              await refresh();
            } catch {
              setError(true);
              setMessage("Chưa thể làm mới danh sách.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Làm mới danh sách
        </button>
      </div>
      {loading ? (
        <p role="status">Đang tải phiên…</p>
      ) : (
        <ul className="session-list">
          {items.map((item, index) => {
            const state = item.revoked_at
              ? "Đã thu hồi"
              : Date.parse(item.expires_at) <= now
                ? "Đã hết hạn"
                : "Đang hoạt động";
            return (
              <li key={item.id}>
                <strong>
                  {item.is_current ? "Phiên hiện tại" : `Phiên ${index + 1}`}
                </strong>
                <p>{state}</p>
                <p className="field-help">
                  Hoạt động gần nhất:{" "}
                  <time dateTime={item.last_seen}>
                    {new Date(item.last_seen).toLocaleString("vi-VN")}
                  </time>
                  <br />
                  Bắt đầu:{" "}
                  <time dateTime={item.created_at}>
                    {new Date(item.created_at).toLocaleString("vi-VN")}
                  </time>
                  <br />
                  Hết hạn:{" "}
                  <time dateTime={item.expires_at}>
                    {new Date(item.expires_at).toLocaleString("vi-VN")}
                  </time>
                </p>
                {state === "Đang hoạt động" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => action(item)}
                  >
                    {item.is_current
                      ? "Thu hồi phiên hiện tại"
                      : "Thu hồi phiên này"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
