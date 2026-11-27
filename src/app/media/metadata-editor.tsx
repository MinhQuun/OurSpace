"use client";

import { useEffect, useRef, useState } from "react";
import type { ViewerItem } from "./viewer";

export type MediaDetail = ViewerItem & {
  favorite: { favorited: boolean; version: string }; description: string | null; memoryDate: string | null; updatedAt: string; version: string; edit: { spaceId: string | null } | null;
};
type Command = { commandId: string; spaceId: string | null; version: string } & ({ title: string; description: string | null } | { memoryDate: string | null });

export default function MetadataEditor({ detail, saved, denied, dirtyChanged }: {
  detail: MediaDetail; saved: (detail: MediaDetail) => void; denied: () => void; dirtyChanged: (dirty: boolean) => void;
}) {
  const [mode, setMode] = useState("metadata");
  const [memoryDate, setMemoryDate] = useState(detail.memoryDate ?? "");
  const [title, setTitle] = useState(detail.title);
  const [description, setDescription] = useState(detail.description ?? "");
  const [pending, setPending] = useState<Command | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [conflict, setConflict] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const dirty = memoryDate !== (detail.memoryDate ?? "") || title !== detail.title || description !== (detail.description ?? "") || !!pending || busy;
  useEffect(() => {
    dirtyChanged(dirty);
    return () => dirtyChanged(false);
  }, [dirty, dirtyChanged]);
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
      ...(mode === "date" ? { memoryDate: memoryDate || null } : { title, description: description || null }),
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
    <label>Chỉnh sửa<select aria-label="Chỉnh sửa" value={mode} disabled={dirty || conflict} onChange={event => setMode(event.target.value)}><option value="metadata">Tiêu đề và mô tả</option><option value="date">Ngày kỷ niệm</option></select></label>
    {dirty && <p>Lưu hoặc hoàn nguyên nội dung đang nhập trước khi chuyển mục chỉnh sửa.</p>}
    {mode === "date" ? <><label>Ngày kỷ niệm<input type="date" min="0001-01-01" max="9999-12-31" value={memoryDate} disabled={busy || !!pending} onChange={event => setMemoryDate(event.target.value)} /></label><p>Để trống để xóa ngày kỷ niệm. Ngày này do bạn chọn, độc lập với ngày tải lên.</p></> : <>
    <label style={{display:"grid",gap:4}}>Tiêu đề ảnh<input required value={title} disabled={busy || !!pending}
      onChange={event => setTitle(event.target.value)} /></label>
    <label style={{display:"grid",gap:4}}>Mô tả ảnh<textarea rows={4} value={description} disabled={busy || !!pending}
      onChange={event => setDescription(event.target.value)} /></label></>}
    <button type="submit" disabled={busy || conflict || (mode === "metadata" && !title.trim())}>{busy ? "Đang lưu…" : pending ? "Thử lưu lại" : "Lưu thông tin"}</button>
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
