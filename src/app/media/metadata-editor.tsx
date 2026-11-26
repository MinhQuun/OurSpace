"use client";

import { useEffect, useRef, useState } from "react";
import type { ViewerItem } from "./viewer";

export type MediaDetail = ViewerItem & {
  description: string | null; updatedAt: string; version: string; edit: { spaceId: string | null } | null;
};
type Command = { commandId: string; spaceId: string | null; version: string; title: string; description: string | null };

export default function MetadataEditor({ detail, saved, denied }: {
  detail: MediaDetail; saved: (detail: MediaDetail) => void; denied: () => void;
}) {
  const [title, setTitle] = useState(detail.title);
  const [description, setDescription] = useState(detail.description ?? "");
  const [pending, setPending] = useState<Command | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [conflict, setConflict] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const refresh = async (signal: AbortSignal) => {
    const response = await fetch(`/api/media/detail/${detail.id}`, { cache: "no-store", signal });
    if ([401, 403, 404].includes(response.status)) { denied(); return; }
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (!signal.aborted) saved(data.media);
  };
  if (!detail.edit) return null;
  return <form aria-label="Chỉnh thông tin ảnh" onSubmit={async event => {
    event.preventDefault();
    if (busy || conflict) return;
    const command = pending ?? {
      commandId: crypto.randomUUID(), spaceId: detail.edit!.spaceId, version: detail.version,
      title, description: description || null,
    };
    const body = JSON.stringify(command);
    if (new TextEncoder().encode(body).length > 16384) { setMessage("Nội dung quá dài để gửi. Vui lòng rút gọn mô tả."); return; }
    const request = new AbortController(); controller.current = request;
    setPending(command); setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/media/detail/${detail.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body, signal: request.signal,
      });
      if ([401, 403, 404].includes(response.status)) { denied(); return; }
      if (response.status === 409) { setConflict(true); setMessage("Thông tin đã thay đổi ở nơi khác. Tải lại để xem bản mới trước khi sửa."); return; }
      if (response.status === 400 || response.status === 413) {
        setPending(null); setMessage("Thông tin không hợp lệ hoặc quá dài. Kiểm tra nội dung rồi lưu lại."); return;
      }
      if (!response.ok) throw new Error();
      await refresh(request.signal);
    } catch {
      if (!request.signal.aborted) setMessage("Chưa xác minh được kết quả lưu. Thử lưu lại sẽ gửi đúng yêu cầu cũ.");
    } finally { if (!request.signal.aborted) setBusy(false); }
  }} style={{display:"grid",gap:12,marginBlock:16}}>
    <label style={{display:"grid",gap:4}}>Tiêu đề ảnh<input required value={title} disabled={busy || !!pending}
      onChange={event => setTitle(event.target.value)} /></label>
    <label style={{display:"grid",gap:4}}>Mô tả ảnh<textarea rows={4} value={description} disabled={busy || !!pending}
      onChange={event => setDescription(event.target.value)} /></label>
    <button type="submit" disabled={busy || conflict || !title.trim()}>{busy ? "Đang lưu…" : pending ? "Thử lưu lại" : "Lưu thông tin"}</button>
    {message && <p role="alert">{message}</p>}
    {conflict && <>
      <p>Tải bản mới sẽ bỏ nội dung đang nhập trong form này.</p>
      <button type="button" disabled={busy} onClick={async () => {
        const request = new AbortController(); controller.current = request; setBusy(true);
        try { await refresh(request.signal); }
        catch { if (!request.signal.aborted) setMessage("Không tải được bản mới. Vui lòng thử lại."); }
        finally { if (!request.signal.aborted) setBusy(false); }
      }}>Bỏ bản đang nhập và tải bản mới</button>
    </>}
  </form>;
}
