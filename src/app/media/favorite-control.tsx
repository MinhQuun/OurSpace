"use client";

import { useEffect, useRef, useState } from "react";

export type Favorite = { favorited: boolean; version: string };
type Command = { commandId: string; favoriteVersion: string; favorited: boolean };

export default function FavoriteControl({ mediaId, initial, denied, dirtyChanged }: {
  mediaId: string; initial: Favorite; denied: () => void; dirtyChanged: (dirty: boolean) => void;
}) {
  const [value, setValue] = useState(initial);
  const [pending, setPending] = useState<Command | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    dirtyChanged(!!pending || busy);
    return () => dirtyChanged(false);
  }, [pending, busy, dirtyChanged]);
  return <div>
    <button type="button" aria-pressed={value.favorited} disabled={busy} onClick={async () => {
      if (busy) return;
      const command = pending ?? { commandId: crypto.randomUUID(), favoriteVersion: value.version, favorited: !value.favorited };
      const request = new AbortController(); controller.current = request;
      setPending(command); setBusy(true); setMessage("");
      try {
        const response = await fetch(`/api/media/detail/${mediaId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(command), signal: request.signal,
        });
        if ([401, 403, 404].includes(response.status)) { denied(); return; }
        if (response.status === 400) { setPending(null); setMessage("Không lưu được lựa chọn. Đóng và mở lại ảnh để thử lại."); return; }
        if (!response.ok && response.status !== 409) throw new Error();
        const current = await fetch(`/api/media/detail/${mediaId}`, { cache: "no-store", signal: request.signal });
        if ([401, 403, 404].includes(current.status)) { denied(); return; }
        if (!current.ok) throw new Error();
        const data = await current.json();
        if (request.signal.aborted) return;
        setValue(data.media.favorite); setPending(null);
        if (response.status === 409) setMessage("Yêu thích đã đổi ở nơi khác. Đã tải lựa chọn mới; bạn có thể chọn lại.");
      } catch {
        if (!request.signal.aborted) setMessage("Chưa xác minh được yêu thích. Thử lại sẽ gửi đúng lựa chọn cũ.");
      } finally { if (!request.signal.aborted) setBusy(false); }
    }}>{busy ? "Đang lưu yêu thích…" : pending ? "Thử lại yêu thích" : value.favorited ? "Bỏ yêu thích" : "Yêu thích"}</button>
    <p>Yêu thích chỉ dành cho tài khoản của bạn.</p>
    {message && <p role="status">{message}</p>}
  </div>;
}
