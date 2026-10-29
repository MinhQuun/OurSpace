"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

type SessionState = {
  session: { accountId: string } | null;
  loaded: boolean;
};

function useSession(): SessionState {
  const [session, setSession] = useState<{ accountId: string } | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (!active) return null;
        if (!response.ok) {
          setSession(null);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        if (
          data &&
          typeof data === "object" &&
          "accountId" in data &&
          typeof (data as { accountId: unknown }).accountId === "string"
        ) {
          setSession({ accountId: (data as { accountId: string }).accountId });
        } else {
          setSession(null);
        }
      })
      .catch(() => {
        if (!active) return;
        setSession(null);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);
  return { session, loaded };
}

function shortId(accountId: string) {
  return accountId.length > 8 ? accountId.slice(0, 8) + "…" : accountId;
}

function SignedInHome({ session }: { session: { accountId: string } }): ReactNode {
  return (
    <>
      <p className="eyebrow">OUR SPACE</p>
      <h1>Chào mừng quay lại</h1>
      <p className="intro">
        Trang chủ của bạn. Dữ liệu hiển thị chỉ những gì tài khoản này có
        quyền xem; nội dung cá nhân của Partner không bị hiển thị qua inference.
      </p>
      <section className="account-card" aria-busy={false}>
        <h2>Tài khoản của bạn</h2>
        <p>Mã tài khoản: <code>{shortId(session.accountId)}</code></p>
        <div className="session-actions">
          <Link href="/account">Tài khoản &amp; cài đặt</Link>
          <Link href="/account/notifications">Thông báo</Link>
          <Link href="/account/spaces">Space và ngừng liên kết</Link>
          <Link href="/account/couple">Hồ sơ chung</Link>
        </div>
      </section>
      <aside role="status">
        <h2>Không gian đang được chuẩn bị</h2>
        <p>
          Các tính năng không gian chung, ảnh ảnh và capsule đang được hoàn
          thiện trong các giai đoạn tiếp theo.
        </p>
      </aside>
    </>
  );
}

export default function Home() {
  const { session, loaded } = useSession();
  if (!loaded) {
    return (
      <main>
        <p className="eyebrow">OUR SPACE</p>
        <h1>Đang tải…</h1>
      </main>
    );
  }
  return session ? <SignedInHome session={session} /> : <SignedOutHome />;
}

function SignedOutHome(): ReactNode {
  return (
    <>
      <p className="eyebrow">OUR SPACE</p>
      <h1>
        Một nơi dành cho
        <br />
        hai chúng mình.
      </h1>
      <p className="intro">
        Những kỷ niệm nhỏ, những dự định lớn — cùng nhau gìn giữ.
      </p>
      <aside role="status">
        <h2>Không gian đang được chuẩn bị</h2>
        <p>
          Bản thử nghiệm đã có đăng ký và đăng nhập. Các tính năng không gian
          chung đang được hoàn thiện.
        </p>
        <Link href="/account">Đăng nhập hoặc tạo tài khoản</Link>
      </aside>
    </>
  );
}
