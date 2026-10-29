"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";

type ExportJob = {
  id: string;
  scope: string;
  status: string;
  result_ref: string | null;
  created_at: string;
  completed_at: string | null;
};

const scopeLabel = (s: string) => (s === "personal" ? "Cá nhân" : "Chia sẻ");
const statusLabel = (s: string) =>
  s === "completed" ? "Hoàn tất" : s === "failed" ? "Thất bại" : "Đang xử lý";

export default function ExportPanel() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [draftScope, setDraftScope] = useState<"personal" | "shared">(
    "personal",
  );
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const retry = useRef({ payload: "", commandId: "" });

  const load = useCallback(() => {
    let active = true;
    fetch("/api/export/list", { cache: "no-store" })
      .then((response) => {
        if (!active) return null;
        if (!response.ok) {
          setFailed(true);
          setMessage("Không thể tải lịch sử xuất.");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setJobs((data?.jobs ?? []) as ExportJob[]);
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

  async function createExport(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const commandId = crypto.randomUUID();
    const payload = JSON.stringify({ scope: draftScope, commandId });
    if (retry.current.payload === payload) return;
    retry.current = { payload, commandId };
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch("/api/export/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ scope: draftScope, commandId }),
      });
      if (response.status === 401) {
        setExpired(true);
        return;
      }
      if (response.status === 409) {
        setFailed(true);
        setMessage("Yêu cầu xuất đã được xử lý ở phiên khác.");
        return;
      }
      if (response.status === 429) {
        setFailed(true);
        setMessage("Yêu cầu quá nhanh. Hãy thử lại sau.");
        return;
      }
      if (response.status === 400) {
        setFailed(true);
        setMessage("Phạm vi xuất không hợp lệ.");
        return;
      }
      if (!response.ok) throw new Error();
      setMessage("Đã tạo yêu cầu xuất.");
      void load();
    } catch {
      setFailed(true);
      setMessage("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

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

  return (
    <section className="account-card" aria-busy={busy}>
      <h1>Xuất dữ liệu</h1>
      <p className="intro">
        Yêu cầu xuất một gói dữ liệu của tài khoản bạn. Gói xuất cá nhân chỉ
        chứa dữ liệu bạn sở hữu; xuất chia sẻ không bao gồm dữ liệu riêng của
        Partner và không bao gồm Time Capsule đã bị kín hoặc bí mật chưa được
        mở.
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
          <form className="account-form" onSubmit={createExport}>
            <fieldset disabled={busy}>
              <legend className="sr-only">Phạm vi xuất</legend>
              <label className="field">
                Phạm vi
                <select
                  value={draftScope}
                  onChange={(event) =>
                    setDraftScope(event.target.value as "personal" | "shared")
                  }
                >
                  <option value="personal">Cá nhân</option>
                  <option value="shared">Chia sẻ</option>
                </select>
              </label>
              <p className="field-help">
                Gói xuất hiện thời gian rỗng khi chưa có phân hệ dữ liệu nào
                được triển khai; đây là khung nền tảng cho xuất dữ liệu sau này.
              </p>
              <button className="button primary" type="submit" disabled={busy}>
                {busy ? "Đang tạo…" : "Tạo yêu cầu xuất"}
              </button>
            </fieldset>
          </form>
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
              disabled={busy}
              onClick={() => load()}
            >
              Tải lại
            </button>
          </div>
          {jobs.length === 0 ? (
            <p role="status" style={{ marginTop: "1rem" }}>
              Chưa có yêu cầu xuất nào.
            </p>
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
              {jobs.map((job) => (
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
                    <div>
                      <strong>{scopeLabel(job.scope)}</strong>
                      <span style={{ opacity: 0.7, marginLeft: "0.5rem" }}>
                        {statusLabel(job.status)}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                      {formatDate(job.created_at)} • xong{" "}
                      {formatDate(job.completed_at)}
                    </div>
                  </div>
                  {job.result_ref && (
                    <p
                      style={{ fontSize: "0.875rem", opacity: 0.7, margin: 0 }}
                    >
                      Mã gói: {job.result_ref}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
