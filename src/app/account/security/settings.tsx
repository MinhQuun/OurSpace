"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import TotpQr from "./totp-qr";

type Enrollment = {
  id: string;
  state: string;
  version: string;
  recovery_issued_at: string | null;
};
const labels: Record<string, string> = {
  pending: "Chờ xác minh TOTP",
  verified: "Chờ lưu mã khôi phục",
  enabled: "Đã bật MFA",
  cancelling: "Đang hủy thiết lập",
  disabling: "Đang tắt MFA",
};
async function loadStatus(signal?: AbortSignal) {
  const [status, pending] = await Promise.all([
    fetch("/api/auth/mfa-status", { cache: "no-store", signal }),
    fetch("/api/auth/mfa-removal-state", { cache: "no-store", signal }),
  ]);
  if ((!status.ok && status.status !== 401) || !pending.ok) throw new Error();
  return {
    signedIn: status.ok,
    enrollment: status.ok ? (await status.json()).enrollment : null,
    removal: Boolean((await pending.json()).pending),
  };
}

export default function MfaSettings() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [removal, setRemoval] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [secret, setSecret] = useState("");
  const [uri, setUri] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [method, setMethod] = useState<"totp" | "recovery">("totp");

  async function refresh(signal?: AbortSignal) {
    const status = await loadStatus(signal);
    setSignedIn(status.signedIn);
    setEnrollment(status.enrollment);
    setRemoval(status.removal);
    if (!status.signedIn) {
      setSecret("");
      setUri("");
      setCodes([]);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadStatus(controller.signal)
      .then((status) => {
        setSignedIn(status.signedIn);
        setEnrollment(status.enrollment);
        setRemoval(status.removal);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFailed(true);
          setMessage("Chưa thể tải cài đặt bảo mật. Hãy tải lại trang.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const button = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const action = button?.value;
    if (!action) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const confirmed = values.get("confirmed") === "on";
    if (
      ["mfa-cancel", "mfa-prepare-removal", "mfa-acknowledge"].includes(
        action,
      ) &&
      !confirmed
    ) {
      setFailed(true);
      setMessage("Vui lòng đánh dấu xác nhận trước khi tiếp tục.");
      return;
    }
    setBusy(true);
    setFailed(false);
    setMessage("");
    try {
      const code = String(values.get("code") ?? "");
      const response = await fetch(`/api/auth/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.get("email"),
          password: values.get("password"),
          enrollmentId: enrollment?.id ?? crypto.randomUUID(),
          version: enrollment?.version,
          code,
          confirmed,
          ...(code ? { secondFactor: { method, code } } : {}),
        }),
      });
      if (!response.ok) {
        setFailed(true);
        setMessage(
          "Chưa thể hoàn tất. Kiểm tra thông tin xác thực; nếu phiên đã hết hạn, hãy đăng nhập lại rồi tiếp tục.",
        );
        await refresh();
        return;
      }
      const result = await response.json();
      setUri(typeof result.uri === "string" ? result.uri : "");
      setSecret(typeof result.secret === "string" ? result.secret : "");
      setCodes(Array.isArray(result.codes) ? result.codes : []);
      form.reset();
      await refresh();
      setMessage(
        action === "mfa-resume-removal"
          ? "Đã hoàn tất. Hãy đăng nhập lại."
          : "Đã lưu bước này. Tiếp tục theo trạng thái bên dưới.",
      );
    } catch {
      setFailed(true);
      setMessage(
        "Mất kết nối. Tải lại trạng thái trước khi thử tiếp; không tự coi thao tác đã hoàn tất.",
      );
    } finally {
      setBusy(false);
    }
  }

  const inRemoval =
    removal || ["cancelling", "disabling"].includes(enrollment?.state ?? "");
  return (
    <section className="account-card mfa-settings" aria-busy={busy}>
      <h1>Xác thực hai bước</h1>
      <p>Bảo vệ tài khoản bằng ứng dụng TOTP và mã khôi phục dùng một lần.</p>
      {message && (
        <p
          role={failed ? "alert" : "status"}
          className={failed ? "form-message form-error" : "form-message"}
        >
          {message}
        </p>
      )}
      {loading ? (
        <p role="status">Đang tải cài đặt…</p>
      ) : (
        <>
          <p data-testid="mfa-state">
            {removal
              ? "Đang chờ hoàn tất hủy/tắt MFA"
              : enrollment
                ? labels[enrollment.state]
                : signedIn
                  ? "Chưa bật MFA"
                  : "Cần đăng nhập"}
          </p>
          {!signedIn && !removal ? (
            <Link href="/account">Đăng nhập để tiếp tục</Link>
          ) : (
            <>
              {secret && (
                <div className="form-message">
                  {uri && <TotpQr uri={uri} />}
                  <p>
                    Thêm tài khoản TOTP trong ứng dụng xác thực bằng khóa này:
                  </p>
                  <code
                    data-testid="totp-secret"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {secret}
                  </code>
                  <p>
                    Khóa chỉ hiện trong lần thiết lập này. Không chia sẻ hoặc
                    chụp ảnh gửi cho người khác.
                  </p>
                </div>
              )}
              {codes.length > 0 && (
                <div className="form-message">
                  <h2>Lưu mã khôi phục</h2>
                  <p>
                    Cất ở nơi riêng tư trước khi xác nhận. Mỗi mã chỉ dùng một
                    lần; tải lại trang sẽ ẩn các mã này.
                  </p>
                  <ul>
                    {codes.map((code) => (
                      <li key={code}>
                        <code>{code}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {enrollment?.state === "pending" && !secret && (
                <p>
                  Nếu chưa lưu khóa TOTP, hãy hủy thiết lập rồi bắt đầu lại.
                </p>
              )}
              {enrollment?.state === "verified" &&
                !codes.length &&
                enrollment.recovery_issued_at && (
                  <p>
                    Nếu chưa lưu các mã trước đó, chọn cấp lại. Bộ mã cũ sẽ hết
                    hiệu lực.
                  </p>
                )}
              <form onSubmit={submit}>
                <fieldset disabled={busy}>
                  <legend>Xác thực lại tài khoản của bạn</legend>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                  </label>
                  <label>
                    Mật khẩu
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      minLength={12}
                      maxLength={1024}
                    />
                  </label>
                  {(inRemoval || enrollment?.state === "enabled") && (
                    <label>
                      Loại mã
                      <select
                        value={method}
                        onChange={(event) =>
                          setMethod(event.target.value as "totp" | "recovery")
                        }
                      >
                        <option value="totp">Ứng dụng TOTP</option>
                        <option value="recovery">Mã khôi phục</option>
                      </select>
                    </label>
                  )}
                  {enrollment || removal ? (
                    <label>
                      {method === "totp" ? "Mã TOTP" : "Mã khôi phục"}
                      <input
                        key={method}
                        name="code"
                        autoComplete="one-time-code"
                        inputMode={method === "totp" ? "numeric" : "text"}
                        maxLength={64}
                      />
                    </label>
                  ) : null}
                  <label>
                    <input type="checkbox" name="confirmed" />{" "}
                    {enrollment?.state === "verified"
                      ? "Nếu bật MFA, tôi xác nhận đã lưu mã khôi phục. Nếu hủy thiết lập, tôi xác nhận việc hủy."
                      : "Tôi xác nhận thao tác hủy/tắt MFA đã chọn."}
                  </label>
                  <div className="mfa-actions">
                    {!enrollment && signedIn && !removal && (
                      <button value="mfa-start">Bắt đầu thiết lập TOTP</button>
                    )}
                    {enrollment?.state === "pending" && (
                      <>
                        <button value="mfa-verify">Xác minh TOTP</button>
                        <button value="mfa-cancel">
                          Hủy thiết lập chưa xác minh
                        </button>
                      </>
                    )}
                    {enrollment?.state === "verified" && (
                      <>
                        <button
                          value={
                            enrollment.recovery_issued_at
                              ? "mfa-replace-recovery"
                              : "mfa-recovery"
                          }
                        >
                          {enrollment.recovery_issued_at
                            ? "Cấp lại mã khôi phục"
                            : "Nhận mã khôi phục"}
                        </button>
                        {codes.length > 0 && (
                          <button value="mfa-acknowledge">
                            Đã lưu mã — bật MFA
                          </button>
                        )}
                        <button value="mfa-prepare-removal">
                          Hủy thiết lập đã xác minh
                        </button>
                      </>
                    )}
                    {enrollment?.state === "enabled" && (
                      <button value="mfa-prepare-removal">
                        Bắt đầu tắt MFA
                      </button>
                    )}
                    {inRemoval && signedIn && (
                      <button value="mfa-prepare-removal">
                        Cấp lại quyền tiếp tục hủy/tắt
                      </button>
                    )}
                    {removal && (
                      <button value="mfa-resume-removal">
                        Hoàn tất hủy/tắt MFA
                      </button>
                    )}
                  </div>
                </fieldset>
              </form>
              {removal && (
                <p>
                  Nếu factor đã được xóa, có thể để trống mã khi tiếp tục. Giữ
                  trình duyệt này cho tới khi hoàn tất.
                </p>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
