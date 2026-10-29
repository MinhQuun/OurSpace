"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePreferences } from "../../preference-runtime";
type Space = { id: string; state: string };
type Profile = { title: string | null; accent: string | null; version: string };
type Revision = {
  title: string | null;
  accent: string | null;
  version: string;
  actor_id: string;
  recorded_at: string;
};
export default function CouplePanel() {
  const { formatDateTime } = usePreferences();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selected, setSelected] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [more, setMore] = useState(false);
  const [title, setTitle] = useState("");
  const [accent, setAccent] = useState("#643c50");
  const [useAccent, setUseAccent] = useState(false);
  const [busy, setBusy] = useState(true);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [conflict, setConflict] = useState(false);
  const retry = useRef({ payload: "", commandId: "" });
  const generation = useRef(0);
  const fail = useCallback((status: number) => {
    if (status === 401) {
      setExpired(true);
      setProfile(null);
      setRevisions([]);
      setTitle("");
      setUseAccent(false);
    }
    if (status === 409) setConflict(true);
    setMessage(
      status === 409
        ? "Hồ sơ đã thay đổi. Tải lại và xem xét tên mới trước khi lưu."
        : status === 429
          ? "Quá nhiều yêu cầu. Hãy chờ rồi thử lại."
          : status === 403
            ? "Không còn quyền chỉnh sửa liên kết này. Hãy tải lại."
            : "Không thể hoàn tất. Hãy thử lại.",
    );
  }, []);
  const refresh = useCallback(
    async (id: string) => {
      const current = ++generation.current;
      setBusy(true);
      setProfile(null);
      setRevisions([]);
      setMessage("");
      setConflict(false);
      try {
        const list = await fetch("/api/spaces/list", { cache: "no-store" });
        if (current !== generation.current) return;
        if (!list.ok) {
          fail(list.status);
          return;
        }
        const available: Space[] = (await list.json()).spaces;
        const chosen =
          available.find((s) => s.id === id) ??
          available.find((s) => s.state === "active") ??
          available[0];
        if (current !== generation.current) return;
        setSpaces(available);
        setSelected(chosen?.id ?? "");
        if (!chosen) return;
        const [read, history] = await Promise.all([
          fetch(`/api/profile/couple?spaceId=${chosen.id}`, {
            cache: "no-store",
          }),
          fetch(`/api/profile/couple_history?spaceId=${chosen.id}`, {
            cache: "no-store",
          }),
        ]);
        if (current !== generation.current) return;
        if (!read.ok || !history.ok) {
          fail(!read.ok ? read.status : history.status);
          return;
        }
        const data = await read.json(),
          past = await history.json();
        if (current !== generation.current) return;
        setProfile(data.profile);
        setTitle(data.profile?.title ?? "");
        setAccent(data.profile?.accent ?? "#643c50");
        setUseAccent(Boolean(data.profile?.accent));
        setRevisions(past.revisions);
        setMore(past.revisions.length === 50);
        retry.current = { payload: "", commandId: "" };
      } catch {
        if (current === generation.current) fail(503);
      } finally {
        if (current === generation.current) setBusy(false);
      }
    },
    [fail],
  );
  const invalidate = useCallback(() => {
    generation.current++;
  }, []);
  useEffect(() => {
    void Promise.resolve().then(() => refresh(""));
    return invalidate;
  }, [refresh, invalidate]);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!profile || busy || conflict) return;
    const data = {
      spaceId: selected,
      version: Number(profile.version),
      title: title.trim() || null,
      accent: useAccent ? accent : null,
    };
    const payload = JSON.stringify(data);
    if (retry.current.payload !== payload)
      retry.current = { payload, commandId: crypto.randomUUID() };
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/profile/couple_update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, commandId: retry.current.commandId }),
      });
      if (!response.ok) {
        fail(response.status);
        return;
      }
      await refresh(selected);
      setMessage("Đã lưu hồ sơ chung.");
    } catch {
      fail(503);
    } finally {
      setBusy(false);
    }
  }
  async function older() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/profile/couple_history?spaceId=${selected}&before=${revisions.at(-1)!.version}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        fail(response.status);
        return;
      }
      const data = await response.json();
      setRevisions((previous) => [...previous, ...data.revisions]);
      setMore(data.revisions.length === 50);
    } catch {
      fail(503);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="account-card" aria-busy={busy}>
      <h1>Hồ sơ chung</h1>
      {expired ? (
        <Link href="/account">Đăng nhập lại</Link>
      ) : (
        <>
          {spaces.length > 0 && (
            <label className="field">
              Liên kết
              <select
                disabled={busy}
                value={selected}
                onChange={(event) => void refresh(event.target.value)}
              >
                {spaces.map((space, index) => (
                  <option key={space.id} value={space.id}>
                    {space.state === "active"
                      ? "Liên kết đang hoạt động"
                      : `Liên kết trước ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className="button"
            disabled={busy}
            onClick={() => void refresh(selected)}
          >
            Tải lại hồ sơ chung
          </button>
          {message && <p role="status">{message}</p>}
          {!busy && !profile && <p>Không có hồ sơ chung được phép xem.</p>}
          {profile && (
            <>
              {spaces.find((s) => s.id === selected)?.state === "active" ? (
                <form onSubmit={save}>
                  <div
                    className="couple-theme-band"
                    style={{
                      background: useAccent ? accent : "var(--line-strong)",
                    }}
                    aria-hidden="true"
                  />
                  <label className="field">
                    Tên không gian chung
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      disabled={busy || conflict}
                    />
                  </label>
                  <label className="field">
                    <span>
                      <input
                        type="checkbox"
                        checked={useAccent}
                        disabled={busy || conflict}
                        onChange={(event) => setUseAccent(event.target.checked)}
                      />{" "}
                      Dùng màu nhấn chung
                    </span>
                    <input
                      type="color"
                      aria-label="Màu nhấn chung"
                      value={accent}
                      disabled={busy || conflict || !useAccent}
                      onChange={(event) => setAccent(event.target.value)}
                    />
                  </label>
                  <p>
                    Để trống để bỏ tên đã đặt. Cả hai thành viên đều thấy thay
                    đổi này. Màu nhấn chỉ đổi giao diện chung, không ghi đè cài
                    đặt cá nhân của từng người.
                  </p>
                  <button
                    className="button button-primary"
                    disabled={
                      busy || conflict || Array.from(title.trim()).length > 120
                    }
                  >
                    Lưu hồ sơ chung
                  </button>
                </form>
              ) : (
                <p>
                  Liên kết đã đóng băng. Tên chung:{" "}
                  {profile.title ?? "Chưa đặt tên"}
                </p>
              )}
              <h2>Lịch sử chỉnh sửa</h2>
              {revisions.length === 0 && <p>Chưa có chỉnh sửa.</p>}
              <ol>
                {revisions.map((row) => (
                  <li key={row.version} style={{ overflowWrap: "anywhere" }}>
                    <strong>{row.title ?? "Chưa đặt tên"}</strong>
                    {row.accent && (
                      <span
                        className="couple-revision-accent"
                        style={{ background: row.accent }}
                        title={`Màu nhấn ${row.accent}`}
                      />
                    )}{" "}
                    <p>
                      Phiên bản {row.version} ·{" "}
                      {formatDateTime(row.recorded_at)}
                    </p>
                    <p>Thành viên: {row.actor_id}</p>
                  </li>
                ))}
              </ol>
              {more && (
                <button
                  className="button"
                  disabled={busy}
                  onClick={() => void older()}
                >
                  Xem lịch sử cũ hơn
                </button>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
