"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./viewer.module.css";
import MetadataEditor, { type MediaDetail } from "./metadata-editor";

export type ViewerItem = { id: string; title: string; mimeType: string; byteSize: number; createdAt: string };

function ImageView({ item, move, denied, updated, dirtyChanged }: {
  item: ViewerItem; move: (step: number) => void; denied: () => void; updated: (item: ViewerItem) => void; dirtyChanged: (dirty: boolean) => void;
}) {
  const [source, setSource] = useState("");
  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const gesture = useRef<{ x: number; distance: number; zoom: number } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";
    void (async () => {
      try {
        const metadata = await fetch(`/api/media/detail/${item.id}`, {
          cache: "no-store", credentials: "same-origin", signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if ([401, 403, 404].includes(metadata.status)) { denied(); return; }
        if (!metadata.ok) throw new Error();
        const current = await metadata.json();
        const response = await fetch(`/api/media/view/${item.id}`, {
          cache: "no-store", credentials: "same-origin", signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if ([401, 403, 404].includes(response.status)) { denied(); return; }
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob); setDetail(current.media); setSource(objectUrl);
      } catch {
        if (!controller.signal.aborted) setError("Không tải được bản xem trước. Đóng và mở lại để thử lại.");
      }
    })();
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [item.id, denied]);

  return <>
    {error && <p role="alert">{error}</p>}
    {!source && !error && <p role="status">Đang tải ảnh…</p>}
    {source && detail && <>
      <h2>{detail.title}</h2>
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
        <img src={source} alt={detail.title} className={styles.image} style={{ width: `${zoom * 100}%` }}
          onError={() => { setSource(""); setError("Không thể hiển thị bản xem trước."); }} />
      </div>
      <details><summary>Thông tin ảnh</summary>
        <p>{detail.description || "Chưa có mô tả."}</p>
        <p>Đang xem bản preview WebP. File gốc: {detail.mimeType} · {detail.byteSize.toLocaleString("vi-VN")} byte.</p>
        <p>Ngày tải lên: <time dateTime={detail.createdAt}>{new Date(detail.createdAt).toLocaleString("vi-VN")}</time></p>
        <p>Cập nhật: <time dateTime={detail.updatedAt}>{new Date(detail.updatedAt).toLocaleString("vi-VN")}</time></p>
        <MetadataEditor key={detail.version} detail={detail} denied={denied} dirtyChanged={dirtyChanged} saved={current => { setDetail(current); updated(current); }} />
      </details>
    </>}
  </>;
}

export default function Viewer({ items, selected, select, close, denied, updated }: {
  items: ViewerItem[]; selected: string; select: (id: string) => void; close: () => void; denied: () => void; updated: (item: ViewerItem) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const historyMarker = useRef<string | null>(null);
  const dirty = useRef(false);
  const dirtyChanged = useCallback((value: boolean) => { dirty.current = value; }, []);
  const mayLeave = useCallback(() => {
    if (dirty.current && !window.confirm("Bỏ bản nháp chưa lưu hoặc chưa xác minh? Yêu cầu đã gửi có thể đã được lưu trên server; đóng ảnh không hoàn tác thao tác đó.")) return false;
    dirty.current = false;
    return true;
  }, []);
  const [fullscreenError, setFullscreenError] = useState("");
  const index = items.findIndex(item => item.id === selected);
  const item = items[index];
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const marker = crypto.randomUUID();
    historyMarker.current = marker;
    // Keep Next's router state; never put media IDs or private titles into browser history.
    // Defer history mutation so Strict Mode effect setup/cleanup does not enqueue a stray back navigation.
    const push = window.setTimeout(() => {
      window.history.pushState({ ...window.history.state, ourspaceViewer: marker }, "", window.location.href);
    }, 0);
    const back = () => {
      if (mayLeave()) close();
      else window.history.pushState({ ...window.history.state, ourspaceViewer: marker }, "", window.location.href);
    };
    const unload = (event: BeforeUnloadEvent) => {
      if (dirty.current) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", unload);
    window.addEventListener("popstate", back);
    node?.showModal();
    return () => {
      window.clearTimeout(push);
      window.removeEventListener("popstate", back);
      window.removeEventListener("beforeunload", unload);
      if (window.history.state?.ourspaceViewer === marker) window.history.back();
      historyMarker.current = null;
      node?.close(); previous?.focus();
    };
  }, [close, mayLeave]);
  const dismiss = () => {
    if (!mayLeave()) return;
    if (historyMarker.current && window.history.state?.ourspaceViewer === historyMarker.current) window.history.back();
    else close();
  };
  const move = (step: number) => { const next = items[index + step]; if (next && mayLeave()) select(next.id); };
  return <dialog ref={dialog} className={styles.dialog} aria-label="Xem ảnh" onCancel={event => { event.preventDefault(); dismiss(); }}
    onKeyDown={event => {
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select") || target.isContentEditable) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    }}>
    <div className={styles.controls}>
      <button type="button" onClick={dismiss}>Đóng ảnh</button>
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
    {item && <ImageView key={item.id} item={item} move={move} denied={denied} updated={updated} dirtyChanged={dirtyChanged} />}
  </dialog>;
}
