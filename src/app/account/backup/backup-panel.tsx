"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type BackupJob = {
  id: string;
  scope: string;
  status: string;
  result_ref: string | null;
  created_at: string;
  completed_at: string | null;
};

const scopeLabel = (s: string) => {
  switch (s) {
    case "personal":
      return "Cá nhân";
    case "shared":
      return "Chia sẻ";
    case "full_system":
      return "Toàn hệ thống";
    default:
      return s;
  }
};
const statusLabel = (s: string) =>
  s === "completed" ? "Hoàn tất" : s === "failed" ? "Thất bại" : "Đang xử lý";
const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function BackupPanel() {
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [restores, setRestores] = useState<BackupJob[]>([]);
  const [createScope, setCreateScope] = useState<
    "personal" | "shared" | "full_system"
  >("personal");
  const [restoreSource, setRestoreSource] = useState<string | null>(null);
  const [restoreScope, setRestoreScope] = useState<
    "personal" | "shared" | "full_system"
  >("personal");
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const retry = useRef({ payload: "", commandId: "" });

  const load = useCallback(() => {
    let active = true;
    const loadList = (path: string, set: (jobs: BackupJob[]) => void) => {
      fetch(path, { cache: "no-store" })
        .then((response) => {
          if (!active) return null;
          if (!response.ok) {
            setFailed(true);
            setMessage("Không thể tải lịch sử sao lưu/phục hồi.");
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (!active) return;
          set((data?.jobs ?? []) as BackupJob[]);
        })
        .catch(() => {
          if (!active) return;
          setFailed(true);
          setMessage("Không thể kết nối. Vui lòng thử lại.");
        });
    };
    loadList("/api/backup/backups_list", setBackups);
    loadList("/api/backup/restores_list", setRestores);
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const busyBackup = busy;
  async function createJob(kind: "backup" | "restore") {
    if (busy) return;
    const commandId = crypto.randomUUID();
    const payload = JSON.stringify({
      kind,
      scope: kind === "backup" ? createScope : restoreScope,
      commandId,
      sourceJobId: kind === "restore" ? restoreSource : null,
    });
    if (retry.current.payload === payload) return;
    retry.current = { payload, commandId };
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch(
        "/api/backup/" +
          (kind === "backup" ? "backups_create" : "restores_create"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: window.location.origin,
          },
          body: JSON.stringify({
            scope: kind === "backup" ? createScope : restoreScope,
            commandId,
            ...(kind === "restore" ? { sourceJobId: restoreSource } : {}),
          }),
        },
      );
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (response.status === 409) {
        setFailed(true);
        setMessage("Yêu cầu đã được xử lý ở phiên khác.");
        return;
      }
      if (response.status === 429) {
        setFailed(true);
        setMessage("Yêu cầu quá nhanh. Hãy thử lại sau.");
        return;
      }
      if (response.status === 400) {
        setFailed(true);
        setMessage("Tham số yêu cầu không hợp lệ.");
        return;
      }
      if (!response.ok) throw new Error();
      setMessage(
        kind === "backup" ? "Đã tạo bản sao lưu." : "Đã tạo yêu cầu phục hồi.",
      );
      load();
    } catch {
      setFailed(true);
      setMessage("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="account-card" aria-busy={busy}>
      <h1>Sao lưu &amp; phục hồi</h1>
      <p className="intro">
        Sao lưu bảo toàn định danh, liên kết, quyền và trạng thái nghiệp vụ.
        Phục hồi kiểm tra tính nhất quán xuyên phân hệ và không tạo bản ghi
        trùng. Không thể bỏ qua khóa thời gian hoặc quyền đã bị thu hồi; phục
        hồi toàn hệ thống không cho một tài khoản đơn phương ghi đè dữ liệu của
        cả hai.
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
          <section style={{ marginTop: "1rem" }}>
            <h2>Tạo sao lưu</h2>
            <form
              className="account-form"
              onSubmit={(event) => {
                event.preventDefault();
                void createJob("backup");
              }}
            >
              <fieldset disabled={busyBackup}>
                <legend className="sr-only">Phạm vi sao lưu</legend>
                <label className="field">
                  Phạm vi
                  <select
                    value={createScope}
                    onChange={(event) =>
                      setCreateScope(
                        event.target.value as
                          | "personal"
                          | "shared"
                          | "full_system",
                      )
                    }
                  >
                    <option value="personal">Cá nhân</option>
                    <option value="shared">Chia sẻ</option>
                    <option value="full_system">Toàn hệ thống</option>
                  </select>
                </label>
                <p className="field-help">
                  Với chưa có phân hệ dữ liệu triển khai, gói sao lưu trống.
                </p>
                <button
                  className="button primary"
                  type="submit"
                  disabled={busyBackup}
                >
                  {busyBackup ? "Đang tạo…" : "Tạo sao lưu"}
                </button>
              </fieldset>
            </form>
          </section>
          <section style={{ marginTop: "1.5rem" }}>
            <h2>Tạo phục hồi</h2>
            <form
              className="account-form"
              onSubmit={(event) => {
                event.preventDefault();
                void createJob("restore");
              }}
            >
              <fieldset disabled={busyBackup}>
                <legend className="sr-only">Phạm vi phục hồi</legend>
                <label className="field">
                  Phạm vi
                  <select
                    value={restoreScope}
                    onChange={(event) =>
                      setRestoreScope(
                        event.target.value as
                          | "personal"
                          | "shared"
                          | "full_system",
                      )
                    }
                  >
                    <option value="personal">Cá nhân</option>
                    <option value="shared">Chia sẻ</option>
                    <option value="full_system">Toàn hệ thống</option>
                  </select>
                </label>
                <label className="field">
                  Bản sao lưu nguồn
                  <select
                    value={restoreSource ?? ""}
                    onChange={(event) =>
                      setRestoreSource(event.target.value || null)
                    }
                  >
                    <option value="">-- Chọn bản sao lưu --</option>
                    {backups.map((b) =>
                      b.status === "completed" ? (
                        <option key={b.id} value={b.id}>
                          {b.scope} • {formatDate(b.created_at)}
                        </option>
                      ) : null,
                    )}
                  </select>
                </label>
                <p className="field-help">
                  Chỉ có thể phục hồi từ bản sao lưu đã hoàn tất và thuộc tài
                  khoản bạn.
                </p>
                <button
                  className="button primary"
                  type="submit"
                  disabled={busyBackup || !restoreSource}
                >
                  {busyBackup ? "Đang tạo…" : "Tạo phục hồi"}
                </button>
              </fieldset>
            </form>
          </section>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="button"
              disabled={busyBackup}
              onClick={() => load()}
            >
              Tải lại
            </button>
          </div>
          <section style={{ marginTop: "1rem" }}>
            <h2>Lịch sử sao lưu</h2>
            {backups.length === 0 ? (
              <p role="status">Chưa có bản sao lưu nào.</p>
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
                {backups.map((job) => (
                  <li
                    key={job.id}
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
                      <strong>{scopeLabel(job.scope)}</strong>
                      <span style={{ opacity: 0.7, marginLeft: "0.5rem" }}>
                        {statusLabel(job.status)}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                      {formatDate(job.created_at)} • xong{" "}
                      {formatDate(job.completed_at)}
                    </div>
                    {job.result_ref && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          opacity: 0.7,
                          margin: 0,
                        }}
                      >
                        Mã gói: {job.result_ref}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section style={{ marginTop: "1rem" }}>
            <h2>Lịch sử phục hồi</h2>
            {restores.length === 0 ? (
              <p role="status">Chưa có yêu cầu phục hồi nào.</p>
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
                {restores.map((job) => (
                  <li
                    key={job.id}
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
                      <strong>{scopeLabel(job.scope)}</strong>
                      <span style={{ opacity: 0.7, marginLeft: "0.5rem" }}>
                        {statusLabel(job.status)}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                      {formatDate(job.created_at)} • xong{" "}
                      {formatDate(job.completed_at)}
                    </div>
                    {job.result_ref && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          opacity: 0.7,
                          margin: 0,
                        }}
                      >
                        Mã gói: {job.result_ref}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </section>
  );
}
