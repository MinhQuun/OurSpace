"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
type Space = { id: string; state: string };
const labels: Record<string, string> = { display_name: "Tên hiển thị", nickname: "Biệt danh", birthday: "Ngày sinh", bio: "Giới thiệu" };
export default function PartnerPanel() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selected, setSelected] = useState("");
  const [profile, setProfile] = useState<Record<string, string | null> | null>(null);
  const [message, setMessage] = useState("");
  const [expired, setExpired] = useState(false);
  const [busy, setBusy] = useState(true);
  const active = useRef<AbortController | null>(null);
  const refresh = useCallback(async (spaceId: string) => {
    active.current?.abort();
    const controller = new AbortController(); active.current = controller;
    const options = { cache: "no-store" as const, signal: controller.signal };
    setProfile(null); setMessage(""); setBusy(true);
    try {
      const list = await fetch("/api/spaces/list", options);
      if (list.status === 401) { setExpired(true); setSpaces([]); return; }
      if (!list.ok) throw new Error();
      const available: Space[] = (await list.json()).spaces;
      if (controller.signal.aborted) return;
      setSpaces(available);
      const chosen = available.find(space => space.id === spaceId) ?? available.find(space => space.state === "active") ?? available[0];
      setSelected(chosen?.id ?? "");
      if (!chosen) { setProfile({}); return; }
      const response = await fetch(`/api/profile/partner?spaceId=${encodeURIComponent(chosen.id)}`, options);
      if (controller.signal.aborted) return;
      if (response.status === 401) { setExpired(true); setSpaces([]); return; }
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!controller.signal.aborted) setProfile(data.profile);
    } catch { if (!controller.signal.aborted) setMessage("Không thể tải hồ sơ. Hãy thử làm mới."); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(() => refresh(selected));
    const focus = () => { void refresh(selected); };
    const visibility = () => {
      if (document.visibilityState === "hidden") { active.current?.abort(); setProfile(null); }
      else focus();
    };
    window.addEventListener("focus", focus); window.addEventListener("pageshow", focus);
    document.addEventListener("visibilitychange", visibility);
    return () => { active.current?.abort(); window.removeEventListener("focus", focus); window.removeEventListener("pageshow", focus); document.removeEventListener("visibilitychange", visibility); };
  }, [refresh, selected]);
  return <section className="account-card" aria-busy={busy}>
    <h1>Hồ sơ Partner</h1>
    {expired ? <Link href="/account">Đăng nhập lại</Link> : <>
      {spaces.length > 0 && <label className="field">Liên kết<select value={selected} onChange={event => { setProfile(null); setSelected(event.target.value); }}>{spaces.map((space, index) => <option key={space.id} value={space.id}>{space.state === "active" ? "Liên kết đang hoạt động" : `Liên kết trước ${index + 1}`}</option>)}</select></label>}
      <button className="button" disabled={busy} onClick={() => { void refresh(selected); }}>Làm mới hồ sơ Partner</button>
      {message && <p role="alert">{message}</p>}
      {busy && <p role="status">Đang kiểm tra quyền xem...</p>}
      {!busy && profile && <>
        {Object.keys(profile).filter(key => key in labels).length === 0 && <p>Không có trường hồ sơ được chia sẻ để hiển thị.</p>}
        <dl>{Object.entries(labels).filter(([key]) => Object.hasOwn(profile, key)).map(([key, label]) => <div key={key}><dt>{label}</dt><dd style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{profile[key] ?? "Chưa cung cấp"}</dd></div>)}</dl>
      </>}
    </>}
  </section>;
}
