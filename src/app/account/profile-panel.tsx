"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type Profile = {
  user_id: string;
  display_name: string;
  nickname: string | null;
  birthday: string | null;
  bio: string | null;
  version: string;
};

export default function ProfilePanel({ onExpired }: { onExpired: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(1);

  const fetchProfile = useCallback(
    async (signal?: AbortSignal) => {
      const response = await fetch("/api/profile", {
        cache: "no-store",
        signal,
      });
      if (response.status === 401) {
        onExpired();
        return;
      }
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProfile(data.profile);
      setVersion(Number(data.profile.version));
    },
    [onExpired],
  );

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (response.status === 401) {
          onExpired();
          return;
        }
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (controller.signal.aborted) return;
        setProfile(data.profile);
        setVersion(Number(data.profile.version));
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
          setMessage("Không thể tải hồ sơ. Hãy thử lại.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();
    return () => controller.abort();
  }, [onExpired]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !profile) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage("");
    setError(false);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({
          commandId: crypto.randomUUID(),
          version,
          displayName: data.get("displayName"),
          nickname: data.get("nickname") || null,
          birthday: data.get("birthday") || null,
          bio: data.get("bio") || null,
        }),
      });
      await response.json().catch(() => ({}));
      if (response.status === 401) {
        onExpired();
        return;
      }
      if (response.status === 409) {
        setError(true);
        setMessage("Hồ sơ đã thay đổi. Hãy tải lại trang.");
        await fetchProfile();
        return;
      }
      if (!response.ok) {
        setError(true);
        setMessage("Không thể cập nhật hồ sơ. Vui lòng kiểm tra thông tin.");
        return;
      }
      await fetchProfile();
      setMessage("Đã lưu hồ sơ.");
    } catch {
      setError(true);
      setMessage("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  if (loading)
    return (
      <section className="account-card">
        <p>Đang tải hồ sơ...</p>
      </section>
    );
  if (error && !profile)
    return (
      <section className="account-card">
        <p className="form-message form-error">{message}</p>
      </section>
    );
  if (!profile) return null;

  return (
    <section className="account-card" aria-busy={busy}>
      <h2>Hồ sơ cá nhân</h2>
      <p className="intro">Chỉ bạn có thể xem và chỉnh sửa hồ sơ riêng này.</p>
      {message && (
        <p
          className={error ? "form-message form-error" : "form-message"}
          role={error ? "alert" : "status"}
        >
          {message}
        </p>
      )}
      <form className="account-form" onSubmit={submit}>
        <label className="field">
          <span>Tên hiển thị *</span>
          <input
            name="displayName"
            defaultValue={profile.display_name}
            required
            maxLength={120}
            autoComplete="name"
          />
        </label>
        <label className="field">
          <span>Biệt danh</span>
          <input
            name="nickname"
            defaultValue={profile.nickname ?? ""}
            maxLength={120}
          />
        </label>
        <label className="field">
          <span>Ngày sinh</span>
          <input
            type="date"
            name="birthday"
            defaultValue={profile.birthday ?? ""}
          />
        </label>
        <label className="field">
          <span>Giới thiệu</span>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            maxLength={4000}
            rows={4}
          />
        </label>
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? "Đang lưu..." : "Lưu hồ sơ"}
        </button>
      </form>
    </section>
  );
}
