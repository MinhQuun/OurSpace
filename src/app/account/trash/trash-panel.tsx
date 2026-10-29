"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type TrashedItem = {
  id: string;
  source_module: string;
  source_type: string;
  source_id: string;
  title_key: string;
  trashed_at: string;
  expires_at: string;
};

const moduleLabel = (m: string) => {
  switch (m) {
    case "M01":
      return "Ảnh ảnh";
    case "M02":
      return "Thư viện phương tiện";
    case "M03":
      return "Địa điểm & kế hoạch hẹn hò";
    case "M04":
      return "Lịch trình du lịch";
    case "M05":
      return "Lịch đôi";
    case "M06":
      return "Danh sách mong muốn & mục tiêu";
    case "M07":
      return "Chi tiêu & tiết kiệm";
    case "M08":
      return "Khoảnh khắc đặc biệt";
    case "M09":
      return "Tương tác đôi";
    default:
      return m;
  }
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TrashPanel() {
  const [items, setItems] = useState<TrashedItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const retry = useRef({ payload: "", commandId: "" });

  const load = useCallback(() => {
    let active = true;
    fetch("/api/trash/list", { cache: "no-store" })
      .then((response) => {
        if (!active) return null;
        if (!response.ok) {
          setFailed(true);
          setMessage("Không thể tải thùng rác.");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setItems((data?.items ?? []) as TrashedItem[]);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
        setMessage("Không thể kết nối. Vui lòng thử lại.");
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function mutate(kind: "restore" | "purge", itemId: string) {
    if (busy) return;
    const commandId = crypto.randomUUID();
    const payload = JSON.stringify({ kind, itemId, commandId });
    if (retry.current.payload === payload) return;
    retry.current = { payload, commandId };
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch("/api/trash/" + kind, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ itemId, commandId }),
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (response.status === 409) {
        setFailed(true);
        setMessage("Thao tác đã được xử lý ở phiên khác. Tải lại.");
        return;
      }
      if (response.status === 429) {
        setFailed(true);
        setMessage("Thao tác quá nhanh. Hãy thử lại sau.");
        return;
      }
      if (response.status === 400) {
        setFailed(true);
        setMessage("Mã yêu cầu không hợp lệ.");
        return;
      }
      if (!response.ok) throw new Error();
      setItems((list) => list.filter((item) => item.id !== itemId));
      setMessage(
        kind === "restore"
          ? "Đã khôi phục nội dung."
          : "Đã xóa vĩnh viễn tham chiếu trong thùng rác.",
      );
    } catch {
      setFailed(true);
      setMessage("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  async function purgeExpired() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch("/api/trash/purge_expired", {
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
      if (!response.ok) throw new Error();
      const data = await response.json();
      setItems([]);
      setMessage(`Đã dọn ${data.purged ?? 0} mục đã hết hạn.`);
    } catch {
      setFailed(true);
      setMessage("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  const expiredCount = items.filter(
    (item) => new Date(item.expires_at) <= new Date(),
  ).length;

  return (
    <section className="account-card" aria-busy={busy}>
      <h1>Thùng rác</h1>
      <p className="intro">
        Nội dung bạn xóa được giữ trong 30 ngày trước khi được dọn vĩnh viễn.
        Khôi phục hoặc xóa vĩnh viễn chỉ tác động đến tham chiếu trong thùng
        rác, không xóa đối tượng nguồn thuộc quyền của một phân hệ khác.
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
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <button
              type="button"
              className="button"
              disabled={busy || expiredCount === 0}
              onClick={purgeExpired}
            >
              Dọn mục hết hạn ({expiredCount})
            </button>
            <button
              type="button"
              className="button"
              disabled={busy}
              onClick={() => load()}
            >
              Tải lại
            </button>
          </div>
          {items.length === 0 ? (
            <p role="status">Thùng rác trống.</p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginTop: "0.5rem",
                display: "grid",
                gap: "0.75rem",
              }}
            >
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong>{item.title_key}</strong>
                      <span style={{ opacity: 0.7, marginLeft: "0.5rem" }}>
                        {moduleLabel(item.source_module)}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                      {formatDate(item.trashed_at)} • hết hạn{" "}
                      {formatDate(item.expires_at)}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    <button
                      type="button"
                      className="button"
                      disabled={busy}
                      onClick={() => mutate("restore", item.id)}
                    >
                      Khôi phục
                    </button>
                    <button
                      type="button"
                      className="button"
                      disabled={busy}
                      onClick={() => mutate("purge", item.id)}
                    >
                      Xóa vĩnh viễn
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
