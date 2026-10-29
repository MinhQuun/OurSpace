"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type ExportJob = { id: string; scope: string; status: string };
export default function ExportPanel() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");
  const command = useRef<string | null>(null);
  const artifact = useRef<string | null>(null);
  const running = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/export/list", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (response.status === 401) { setExpired(true); return; }
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!controller.signal.aborted) setJobs(data.jobs);
      }).catch(() => {
        if (!controller.signal.aborted) setMessage("Không thể tải lịch sử xuất.");
      });
    return () => controller.abort();
  }, []);

  async function download() {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setMessage("");
    try {
      if (!artifact.current) {
        command.current ??= crypto.randomUUID();
        const response = await fetch("/api/export/account_create", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commandId: command.current }), cache: "no-store",
        });
        if (response.status === 401) { setExpired(true); setJobs([]); return; }
        if (response.status === 429) { setMessage("Yêu cầu quá nhanh. Vui lòng thử lại sau."); return; }
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (typeof data.artifactId !== "string") throw new Error();
        artifact.current = data.artifactId;
      }
      const response = await fetch("/api/export/account_download?artifactId=" + encodeURIComponent(artifact.current!), { cache: "no-store" });
      if (response.status === 401) { setExpired(true); setJobs([]); artifact.current = null; return; }
      if (response.status === 404) {
        artifact.current = null; command.current = null;
        setMessage("Bản xuất đã hết hạn hoặc không còn khả dụng. Hãy tạo lại."); return;
      }
      if (response.status === 429) { setMessage("Yêu cầu quá nhanh. Vui lòng thử lại sau."); return; }
      if (!response.ok) throw new Error();
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url; link.download = "ourspace-profile-preferences.json";
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      artifact.current = null; command.current = null;
      setMessage("Đã chuyển tệp hồ sơ và thiết lập cho trình duyệt tải xuống.");
    } catch {
      setMessage("Không thể tải tệp. Vui lòng thử lại.");
    } finally { running.current = false; setBusy(false); }
  }

  return <section className="account-card" aria-busy={busy}>
    <h1>Xuất dữ liệu</h1>
    <h2>Hồ sơ và thiết lập cá nhân</h2>
    <p>Tệp JSON gồm tên hiển thị, biệt danh, ngày sinh, giới thiệu và thiết lập giao diện của bạn. Không gồm ảnh, nội dung các phân hệ hoặc dữ liệu Partner.</p>
    <p>Bản xuất có thể tải trong một giờ kể từ khi tạo. Mỗi lần tải cần phiên đăng nhập hợp lệ.</p>
    {message && <p role="status" className="form-message">{message}</p>}
    {expired ? <Link href="/account">Đăng nhập lại</Link> :
      <button type="button" className="button primary" disabled={busy} onClick={() => void download()}>
        {busy ? "Đang chuẩn bị…" : "Tải hồ sơ và thiết lập"}
      </button>}
    <h2>Xuất toàn bộ dữ liệu</h2>
    <p>Xuất toàn bộ dữ liệu cá nhân và dữ liệu chia sẻ chưa khả dụng.</p>
    {!expired && <><h2>Lịch sử yêu cầu xuất toàn bộ</h2>
      {jobs.length === 0 ? <p>Chưa có yêu cầu xuất nào.</p> :
        <ul>{jobs.map(job => <li key={job.id}>
          {job.scope === "personal" ? "Cá nhân" : "Chia sẻ"}: {job.status === "failed" ? "Thất bại" : job.status === "completed" ? "Hoàn tất" : "Đang xử lý"}
        </li>)}</ul>}
    </>}
  </section>;
}
