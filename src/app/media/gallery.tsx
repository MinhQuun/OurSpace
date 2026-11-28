"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./gallery.module.css";
import Viewer from "./viewer";

type Media = { id: string; title: string; mimeType: string; byteSize: number; createdAt: string };

function Preview({ item }: { item: Media }) {
  const [failed, setFailed] = useState(false);
  if (failed || !["image/jpeg", "image/png", "image/webp"].includes(item.mimeType)) {
    return <div className={styles.fallback}>Chưa có bản xem trước</div>;
  }
  // Native same-origin requests carry the session cookie; never send private images through an optimizer.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.preview} src={`/api/media/preview/${item.id}`} alt={item.title}
    loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}

export default function Gallery() {
  const [items, setItems] = useState<Media[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(false);
  const [type, setType] = useState("");
  const [textDraft, setTextDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [filters, setFilters] = useState({ text: "", tag: "" });
  const updateItem = useCallback((item: Media) => setItems(previous => previous.map(old => old.id === item.id ? item : old)), []);
  const [cursor, setCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const request = useRef<AbortController | null>(null);
  const viewerDenied = useCallback(() => {
    setSelected(null); setItems([]); setCursor(null);
    setError("Media không còn khả dụng hoặc phiên đăng nhập đã kết thúc. Hãy làm mới thư viện.");
  }, []);

  const load = useCallback(async (after: string | null = null) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true); setError(""); setEnded(false);
    if (!after) { setSelected(null); setItems([]); setCursor(null); }
    try {
      const query = new URLSearchParams();
      if (after) query.set("after", after);
      if (favorites) query.set("favorites", "true");
      if (filters.text) query.set("q", filters.text);
      if (filters.tag) query.set("tag", filters.tag);
      if (type) query.set("type", type);
      const response = await fetch(`/api/media/list${query.size ? `?${query}` : ""}`, {
        cache: "no-store", credentials: "same-origin", signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      if (response.status === 401 || response.status === 403) {
        setItems([]); setCursor(null); setEnded(true);
        setError("Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại."); return;
      }
      if (!response.ok) throw new Error("list failed");
      const data = await response.json() as { media: Media[]; nextCursor: string | null };
      if (controller.signal.aborted) return;
      setItems(previous => after ? [...previous, ...data.media.filter(item => !previous.some(old => old.id === item.id))] : data.media);
      setCursor(data.nextCursor);
    } catch {
      if (!controller.signal.aborted) setError("Không tải được thư viện. Vui lòng thử lại.");
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }, [favorites, filters, type]);
  const closeViewer = useCallback(() => { setSelected(null); if (favorites || filters.text || filters.tag || type) void load(); }, [favorites, filters, type, load]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => { window.clearTimeout(initialLoad); request.current?.abort(); };
  }, [load]);
  useEffect(() => {
    const visibility = () => {
      if (selected) return; // Viewer masks and revalidates itself without losing the draft.
      if (document.visibilityState === "hidden") {
        request.current?.abort(); setSelected(null); setItems([]); setCursor(null); setBusy(true);
      } else void load();
    };
    window.addEventListener("pageshow", visibility);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("pageshow", visibility);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [load, selected]);

  return <section aria-label="Thư viện media" aria-busy={busy}>
    <form onSubmit={event => { event.preventDefault(); setFilters({text: textDraft.trim(), tag: tagDraft.trim()}); }}>
      <fieldset disabled={!!selected}>
        <legend>Tìm kiếm media</legend>
        <p>Tìm trong tiêu đề, mô tả và nhãn. Các điều kiện được kết hợp với nhau.</p>
        <label>Từ khóa<input value={textDraft} onChange={event => setTextDraft(event.target.value)} /></label>
        <label>Nhãn chính xác<input value={tagDraft} onChange={event => setTagDraft(event.target.value)} /></label>
        <button type="submit">Áp dụng tìm kiếm</button>
        {filters.text && <button type="button" onClick={() => { setTextDraft(""); setFilters(previous => ({...previous, text: ""})); }}>Xóa từ khóa</button>}
        {filters.tag && <button type="button" onClick={() => { setTagDraft(""); setFilters(previous => ({...previous, tag: ""})); }}>Xóa lọc nhãn</button>}
        <button type="button" onClick={() => { setTextDraft(""); setTagDraft(""); setFilters({text: "", tag: ""}); setFavorites(false); setType(""); }}>Xóa tất cả bộ lọc</button>
      </fieldset>
    </form>
    <label>Loại media<select aria-label="Loại media" value={type} disabled={!!selected} onChange={event => setType(event.target.value)}><option value="">Tất cả loại</option><option value="photo">Ảnh</option><option value="video">Video</option></select></label>
    <label>Hiển thị<select aria-label="Hiển thị media" value={favorites ? "favorites" : "all"} disabled={!!selected} onChange={event => setFavorites(event.target.value === "favorites")}><option value="all">Tất cả media</option><option value="favorites">Yêu thích của tôi</option></select></label>
    <p><button type="button" disabled={busy} onClick={() => void load()}>Làm mới thư viện</button></p>
    {error && <p role="alert">{error}</p>}
    {error && !ended && <button type="button" disabled={busy} onClick={() => void load(cursor)}>Thử lại</button>}
    {!busy && !error && items.length === 0 && <p>{filters.text || filters.tag || type ? "Không có media phù hợp với bộ lọc." : favorites ? "Chưa có media yêu thích còn khả dụng." : "Chưa có media. Tải ảnh đầu tiên để lưu kỷ niệm."}</p>}
    <ul className={styles.grid}>
      {items.map(item => <li key={item.id} className={styles.card}>
        <button type="button" onClick={() => setSelected(item.id)} aria-label={`Xem ${item.title}`} style={{width:"100%"}}><Preview item={item} /></button>
        <h2>{item.title}</h2>
        <p>{item.mimeType} · {item.byteSize.toLocaleString("vi-VN")} byte</p>
        <p>Ngày tải lên: <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString("vi-VN")}</time></p>
      </li>)}
    </ul>
    {selected && items.some(item => item.id === selected) && <Viewer items={items} selected={selected} select={setSelected} close={closeViewer} denied={viewerDenied} updated={updateItem} />}
    {busy && <p role="status">Đang tải thư viện…</p>}
    {cursor && !error && <button type="button" disabled={busy} onClick={() => void load(cursor)}>Xem thêm media</button>}
  </section>;
}
