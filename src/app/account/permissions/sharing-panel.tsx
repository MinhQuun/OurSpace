"use client";
import styles from "./sharing.module.css";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type {
  ResourceGrant,
  SharingOption,
} from "../../../modules/m10/permissions/service.server";
const labels: Record<string, string> = {
  viewer: "Người xem",
  commenter: "Người bình luận",
  editor: "Người chỉnh sửa",
};
type Space = { id: string; partner_id: string; partner_name: string | null };
export default function SharingPanel({
  resourceId,
  onChanged,
}: {
  resourceId: string;
  onChanged: () => void;
}) {
  const [data, setData] = useState<{
    grants: ResourceGrant[];
    options: SharingOption[];
    spaces: Space[];
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const commands = useRef(new Map<string, string>());
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const responses = await Promise.all(
          [
            `/api/permissions/grants?resourceId=${encodeURIComponent(resourceId)}`,
            `/api/permissions/options?resourceId=${encodeURIComponent(resourceId)}`,
            "/api/spaces/list",
          ].map((url) =>
            fetch(url, { cache: "no-store", signal: controller.signal }),
          ),
        );
        if (responses.some((response) => !response.ok)) throw new Error();
        const [grants, options, spaces] = await Promise.all(
          responses.map((response) => response.json()),
        );
        if (!controller.signal.aborted)
          setData({
            grants: grants.grants,
            options: options.options,
            spaces: spaces.spaces,
          });
      } catch {
        if (!controller.signal.aborted)
          setMessage("Chưa thể tải lựa chọn chia sẻ. Hãy kiểm tra lại quyền.");
      }
    }
    void load();
    return () => controller.abort();
  }, [resourceId]);
  async function submit(
    event: FormEvent<HTMLFormElement>,
    action: "grant" | "revoke",
    choice: SharingOption | ResourceGrant,
  ) {
    event.preventDefault();
    const form = event.currentTarget;
    if (busy || new FormData(form).get("confirmed") !== "on") return;
    const version = Number(choice.resource_version);
    if (!Number.isSafeInteger(version)) {
      setMessage("Phiên bản không hợp lệ. Hãy kiểm tra lại quyền.");
      return;
    }
    const target =
      "grant_id" in choice
        ? { grantId: choice.grant_id }
        : {
            spaceId: choice.space_id,
            recipientId: choice.recipient_id,
            role: choice.role,
          };
    const key = JSON.stringify({ action, resourceId, version, ...target });
    let commandId = commands.current.get(key);
    if (!commandId) {
      commandId = crypto.randomUUID();
      commands.current.set(key, commandId);
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/permissions/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          version,
          confirmed: true,
          commandId,
          ...target,
        }),
      });
      if (response.ok) {
        onChanged();
        return;
      }
      setMessage(
        response.status === 409
          ? "Quyền đã thay đổi. Hãy kiểm tra lại trước khi xác nhận."
          : response.status === 429
            ? "Bạn thao tác nhiều lần. Vui lòng thử lại sau."
            : response.status === 401
              ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
              : "Không thể thay đổi quyền. Hãy kiểm tra lại quyền hiện tại.",
      );
    } catch {
      setMessage(
        "Chưa xác định được kết quả. Bạn có thể thử lại cùng thao tác hoặc kiểm tra lại quyền.",
      );
    } finally {
      form.reset();
      setBusy(false);
    }
  }
  return (
    <section aria-labelledby="sharing-title" aria-busy={busy}>
      <h2 id="sharing-title">Quản lý chia sẻ</h2>
      <p>
        Chỉ áp dụng cho nội dung này. Tài nguyên đính kèm giữ quyền riêng; chia
        sẻ nội dung không tự mở tài nguyên Private.
      </p>
      <p role="alert">{message}</p>
      {!data && !message && <p>Đang tải lựa chọn chia sẻ…</p>}
      {data?.options.map((option) => (
        <form
          key={`${option.space_id}:${option.recipient_id}:${option.role}`}
          onSubmit={(event) => void submit(event, "grant", option)}
        >
          <fieldset disabled={busy}>
            <legend>
              Cấp quyền {labels[option.role]} cho{" "}
              {option.recipient_name ?? "người đã ghép đôi"}
            </legend>
            <label className={styles.consent}>
              <input name="confirmed" type="checkbox" required /> Tôi xác nhận
              chia sẻ nội dung với người này theo vai trò đã chọn.
            </label>
            <button type="submit">Cấp quyền</button>
          </fieldset>
        </form>
      ))}
      {data?.grants.map((grant) => (
        <form
          key={grant.grant_id}
          onSubmit={(event) => void submit(event, "revoke", grant)}
        >
          <fieldset disabled={busy}>
            <legend>
              {data.spaces.find(
                (space) =>
                  space.id === grant.space_id &&
                  space.partner_id === grant.grantee_id,
              )?.partner_name ?? "Tài khoản đã được cấp quyền"}{" "}
              — {labels[grant.role] ?? grant.role}
            </legend>
            <p>
              Thu hồi chặn truy cập mới qua quyền này. Bản đã tải về bên ngoài
              không thể thu hồi.
            </p>
            <label className={styles.consent}>
              <input name="confirmed" type="checkbox" required /> Tôi xác nhận
              thu hồi quyền này.
            </label>
            <button type="submit">Thu hồi quyền</button>
          </fieldset>
        </form>
      ))}
      {data && data.grants.length === 0 && (
        <p>Chưa cấp quyền cho người khác.</p>
      )}
      {data && data.options.length === 0 && (
        <p>Hiện không có lựa chọn cấp quyền mới.</p>
      )}
    </section>
  );
}
