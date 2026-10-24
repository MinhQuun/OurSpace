"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import SessionPanel from "./session-panel";

export default function AccountForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [state, setState] = useState<"loading" | "guest" | "signed-in">(
    "loading",
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [factorMethod, setFactorMethod] = useState<"totp" | "recovery">("totp");
  const sessionExpired = useCallback(() => {
    setState("guest");
    setMode("login");
    setFailed(false);
    setMessage("Phiên đã kết thúc. Vui lòng đăng nhập lại.");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        setState(response.ok ? "signed-in" : "guest");
        if (!response.ok && response.status !== 401) {
          setFailed(true);
          setMessage("Chưa thể kết nối. Vui lòng thử lại sau.");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState("guest");
          setFailed(true);
          setMessage("Không thể kết nối. Vui lòng kiểm tra mạng.");
        }
      });
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          ...(mode === "login" && mfaRequired
            ? { secondFactor: { method: factorMethod, code: data.get("code") } }
            : {}),
          ...(mode === "signup"
            ? { displayName: data.get("displayName") }
            : {}),
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        if (response.status === 401 && result.error === "mfa_required") {
          setMfaRequired(true);
          setMessage(
            "Nhập mã từ ứng dụng xác thực hoặc dùng một mã khôi phục chưa sử dụng.",
          );
          return;
        }
        setFailed(true);
        setMessage(
          response.status === 401
            ? "Không thể đăng nhập. Kiểm tra email, mật khẩu, xác minh email và mã xác thực nếu có."
            : response.status === 400
              ? "Vui lòng kiểm tra các thông tin đã nhập."
              : "Chưa thể xử lý yêu cầu. Vui lòng thử lại sau.",
        );
        return;
      }
      form.reset();
      setMfaRequired(false);
      setFactorMethod("totp");
      if (mode === "signup") {
        setMode("login");
        setMessage(
          "Hãy kiểm tra hộp thư và xác minh email trước khi đăng nhập.",
        );
      } else {
        setState("signed-in");
        setMessage("Đăng nhập thành công.");
      }
    } catch {
      setFailed(true);
      setMessage("Không thể kết nối. Vui lòng kiểm tra mạng rồi thử lại.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setFailed(false);
    setMessage("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      setState("guest");
      setMode("login");
      setMessage("Bạn đã đăng xuất.");
    } catch {
      setFailed(true);
      setMessage("Chưa thể đăng xuất. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="account-card" aria-busy={busy}>
      <h1>
        {state === "signed-in"
          ? "Tài khoản của bạn"
          : mode === "signup"
            ? "Tạo tài khoản"
            : "Đăng nhập"}
      </h1>
      <p className="intro">
        Một tài khoản riêng, một không gian chung khi cả hai sẵn sàng.
      </p>
      {message && (
        <p
          className={failed ? "form-message form-error" : "form-message"}
          role={failed ? "alert" : "status"}
        >
          {message}
        </p>
      )}
      {state === "loading" ? (
        <p role="status">Đang kiểm tra phiên đăng nhập…</p>
      ) : state === "signed-in" ? (
        <>
          <button type="button" disabled={busy} onClick={logout}>
            {busy ? "Đang đăng xuất…" : "Đăng xuất"}
          </button>
          <SessionPanel onExpired={sessionExpired} />
        </>
      ) : (
        <>
          <form onSubmit={submit}>
            <fieldset disabled={busy}>
              <legend className="sr-only">Thông tin tài khoản</legend>
              {mode === "signup" && (
                <label>
                  Tên hiển thị
                  <input
                    name="displayName"
                    autoComplete="name"
                    required
                    maxLength={120}
                  />
                </label>
              )}
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
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  required
                  minLength={12}
                  maxLength={1024}
                  aria-describedby="password-help"
                />
              </label>
              <p id="password-help" className="field-help">
                Mật khẩu có ít nhất 12 ký tự.
              </p>
              {mode === "login" && mfaRequired && (
                <>
                  <p className="field-help" id="factor-help">
                    Mã khôi phục chỉ dùng được một lần. Không chia sẻ mã với
                    người khác.
                  </p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                      setFactorMethod(
                        factorMethod === "totp" ? "recovery" : "totp",
                      )
                    }
                  >
                    {factorMethod === "totp"
                      ? "Dùng mã khôi phục"
                      : "Dùng ứng dụng xác thực"}
                  </button>
                  <label>
                    {factorMethod === "totp"
                      ? "Mã xác thực 6 chữ số"
                      : "Mã khôi phục"}
                    <input
                      key={factorMethod}
                      name="code"
                      type="text"
                      inputMode={factorMethod === "totp" ? "numeric" : "text"}
                      autoComplete="one-time-code"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      minLength={factorMethod === "totp" ? 6 : 13}
                      maxLength={factorMethod === "totp" ? 6 : 64}
                      pattern={factorMethod === "totp" ? "[0-9]{6}" : undefined}
                      aria-describedby="factor-help"
                    />
                  </label>
                </>
              )}
              <button type="submit">
                {busy
                  ? "Đang xử lý…"
                  : mode === "signup"
                    ? "Tạo tài khoản"
                    : "Đăng nhập"}
              </button>
            </fieldset>
          </form>
          <button
            className="text-button"
            type="button"
            disabled={busy}
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMfaRequired(false);
              setFactorMethod("totp");
              setMessage("");
              setFailed(false);
            }}
          >
            {mode === "login"
              ? "Chưa có tài khoản? Đăng ký"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </>
      )}
      <p className="field-help">
        Bản thử nghiệm đang được hoàn thiện. Ghép đôi và các tính năng không
        gian chung chưa mở.
      </p>
    </section>
  );
}
