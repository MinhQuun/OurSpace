"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./viewer.module.css";

export type ViewerItem = { id: string; title: string; mimeType: string; byteSize: number; createdAt: string };

function ImageView({ item, move, denied }: {
  item: ViewerItem; move: (step: number) => void; denied: () => void;
}) {
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const gesture = useRef<{ x: number; distance: number; zoom: number } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";
    void (async () => {
      try {
        const response = await fetch(`/api/media/view/${item.id}`, {
          cache: "no-store", credentials: "same-origin", signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if ([401, 403, 404].includes(response.status)) { denied(); return; }
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob); setSource(objectUrl);
      } catch {
        if (!controller.signal.aborted) setError("Không tải được bản xem trước. Đóng và mở lại để thử lại.");
      }
    })();
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [item.id, denied]);

  return <>
    {error && <p role="alert">{error}</p>}
    {!source && !error && <p role="status">Đang tải ảnh…</p>}
    {source && <>
      <h2>{item.title}</h2>
      <div className={styles.controls}>
        <button type="button" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .5))}>Thu nhỏ</button>
        <output aria-label="Mức thu phóng">{Math.round(zoom * 100)}%</output>
        <button type="button" disabled={zoom >= 4} onClick={() => setZoom(value => Math.min(4, value + .5))}>Phóng to</button>
      </div>
      <div className={styles.viewport} onTouchStart={event => {
        const touches = event.touches;
        gesture.current = { x: touches[0].clientX, zoom, distance: touches.length === 2 ? Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY) : 0 };
      }} onTouchMove={event => {
        const start = gesture.current;
        if (start?.distance && event.touches.length === 2) {
          const [a, b] = [event.touches[0], event.touches[1]];
          setZoom(Math.min(4, Math.max(1, start.zoom * Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / start.distance)));
        }
      }} onTouchEnd={event => {
        const start = gesture.current;
        if (start && !start.distance && zoom === 1 && event.changedTouches.length === 1) {
          const delta = event.changedTouches[0].clientX - start.x;
          if (Math.abs(delta) > 60) move(delta < 0 ? 1 : -1);
        }
        gesture.current = null;
      }}>
        {/* Private decoded bytes stay in a short-lived object URL, never in an image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={source} alt={item.title} className={styles.image} style={{ width: `${zoom * 100}%` }}
          onError={() => { setSource(""); setError("Không thể hiển thị bản xem trước."); }} />
      </div>
      <details><summary>Thông tin ảnh</summary>
        <p>Đang xem bản preview WebP. File gốc: {item.mimeType} · {item.byteSize.toLocaleString("vi-VN")} byte.</p>
        <p>Ngày tải lên: <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString("vi-VN")}</time></p>
      </details>
    </>}
  </>;
}

export default function Viewer({ items, selected, select, close, denied }: {
  items: ViewerItem[]; selected: string; select: (id: string) => void; close: () => void; denied: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [fullscreenError, setFullscreenError] = useState("");
  const index = items.findIndex(item => item.id === selected);
  const item = items[index];
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    node?.showModal();
    return () => { node?.close(); previous?.focus(); };
  }, []);
  const move = (step: number) => { const next = items[index + step]; if (next) select(next.id); };
  return <dialog ref={dialog} className={styles.dialog} aria-label="Xem ảnh" onCancel={close}
    onKeyDown={event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    }}>
    <div className={styles.controls}>
      <button type="button" onClick={close}>Đóng ảnh</button>
      <button type="button" disabled={index <= 0} onClick={() => move(-1)}>Ảnh trước</button>
      <button type="button" disabled={index >= items.length - 1} onClick={() => move(1)}>Ảnh tiếp</button>
      <button type="button" onClick={async () => {
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else if (dialog.current?.requestFullscreen) await dialog.current.requestFullscreen();
          else throw new Error();
        } catch { setFullscreenError("Trình duyệt không hỗ trợ chế độ toàn màn hình."); }
      }}>Toàn màn hình</button>
    </div>
    {fullscreenError && <p role="status">{fullscreenError}</p>}
    {item && <ImageView key={item.id} item={item} move={move} denied={denied} />}
  </dialog>;
}
