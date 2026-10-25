"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

export default function ResetForm() {
  const token = useRef("");
  const invalidLink = useRef(false);
  const [stage, setStage] = useState("loading");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    invalidLink.current ||= location.hash === "#invalid";
    token.current ||=
      new URLSearchParams(location.hash.slice(1)).get("token") ?? "";
    history.replaceState(null, "", location.pathname);
    const controller = new AbortController();
    fetch("/api/auth/password-state", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const state = await response.json();
        setStage(
          invalidLink.current ? "request" : token.current ? "prepare" : state.prepared ? "complete" : "request",
        );
        if (invalidLink.current) {
          setFailed(true);
          setMessage("Link phục hồi không hợp lệ. Hãy yêu cầu email mới.");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStage("request");
          setFailed(true);
          setMessage("Chưa thể tải trạng thái. Hãy thử lại.");
        }
      });
    return () => controller.abort();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    if (
      stage === "complete" &&
      (password !== data.get("repeat") || data.get("confirmed") !== "on")
    ) {
      setFailed(true);
      setMessage(
        "Kiểm tra mật khẩu nhập lại và xác nhận thu hồi các phiên đăng nhập.",
      );
      return;
    }
    setBusy(true);
    setFailed(false);
    setMessage("");
    try {
      const code = String(data.get("code") ?? "");
      const action =
        stage === "request"
          ? "password-recovery"
          : stage === "prepare"
            ? "password-prepare"
            : "password-complete";
      const response = await fetch(`/api/auth/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          stage === "request"
            ? { email: data.get("email") }
            : stage === "prepare"
              ? {
                  tokenHash: token.current,
                  ...(code
                    ? { secondFactor: { method: data.get("method"), code } }
                    : {}),
                }
              : { password, confirmed: true },
        ),
      });
      if (!response.ok) {
        setFailed(true);
        setMessage(
          "Chưa thể hoàn tất. Nếu link hoặc phiên phục hồi không còn hiệu lực, hãy yêu cầu email mới. Tài khoản bật MFA cần mã xác thực hợp lệ.",
        );
        if (stage === "prepare" || (stage === "complete" && response.status === 401)) {
          form.reset();
          token.current = "";
          setStage("request");
        }
        return;
      }
      form.reset();
      if (stage === "request")
        setMessage(
          "Nếu email đủ điều kiện, hướng dẫn phục hồi sẽ được gửi. Vui lòng chờ ít nhất một phút trước khi yêu cầu lại.",
        );
      if (stage === "prepare") {
        token.current = "";
        setStage("complete");
      }
      if (stage === "complete") {
        setStage("done");
        setMessage("Đã đặt lại mật khẩu. Hãy đăng nhập lại bằng mật khẩu mới.");
      }
    } catch {
      setFailed(true);
      setMessage(
        "Mất kết nối. Tải lại trang để kiểm tra trạng thái trước khi tiếp tục.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="account-card mfa-settings" aria-busy={busy}>
      <h1>Đặt lại mật khẩu</h1>
      {message && (
        <p role={failed ? "alert" : "status"} className="form-message">
          {message}
        </p>
      )}
      {stage === "loading" ? (
        <p>Đang tải…</p>
      ) : stage === "done" ? (
        <Link href="/account">Đăng nhập lại</Link>
      ) : (
        <form onSubmit={submit}>
          <fieldset disabled={busy}>
            {stage === "request" && (
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
            )}
            {stage === "prepare" && (
              <>
                <p>
                  Chọn tiếp tục để xác minh link. Nếu đã bật MFA, nhập mã TOTP
                  hoặc mã khôi phục.
                </p>
                <label>
                  Loại mã
                  <select name="method">
                    <option value="totp">TOTP</option>
                    <option value="recovery">Mã khôi phục</option>
                  </select>
                </label>
                <label>
                  Mã xác thực
                  <input
                    name="code"
                    autoComplete="one-time-code"
                    maxLength={64}
                  />
                </label>
              </>
            )}
            {stage === "complete" && (
              <>
                <label>
                  Mật khẩu mới
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={12}
                    maxLength={1024}
                  />
                </label>
                <label>
                  Nhập lại mật khẩu
                  <input
                    name="repeat"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={12}
                    maxLength={1024}
                  />
                </label>
                <label>
                  <input name="confirmed" type="checkbox" /> Tôi xác nhận đổi
                  mật khẩu và thu hồi các phiên đăng nhập.
                </label>
              </>
            )}
            <button>
              {stage === "request"
                ? "Gửi email phục hồi"
                : stage === "prepare"
                  ? "Tiếp tục phục hồi"
                  : "Lưu mật khẩu mới"}
            </button>
          </fieldset>
        </form>
      )}
      {stage === "complete" && (
        <p>
          <button type="button" disabled={busy} onClick={() => { setStage("request"); setMessage(""); setFailed(false); }}>
            Yêu cầu email mới
          </button>{" "}
          nếu phiên đã hết hạn.
        </p>
      )}
    </section>
  );
}
