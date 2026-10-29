"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SharingPanel from "./sharing-panel";
import type { BasePermissionInspection } from "../../../modules/m10/permissions/service.server";
const roles = {
  owner: "Chủ sở hữu",
  editor: "Người chỉnh sửa",
  commenter: "Người bình luận",
  viewer: "Người xem",
};
type Grantee = {
  grant_id: string;
  resource_version: string;
  space_id: string;
  recipient_id: string;
  recipient_name: string | null;
  role: string;
  granted_at: string;
};
export default function PermissionPanel({
  resourceId,
}: {
  resourceId: string;
}) {
  const [result, setResult] = useState<BasePermissionInspection | null>(null);
  const [grantees, setGrantees] = useState<Grantee[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(true);
  const [login, setLogin] = useState(false);

  const load = useCallback(() => {
    let active = true;
    const inspectController = new AbortController();
    const grantsController = new AbortController();
    async function run() {
      setBusy(true);
      setResult(null);
      setGrantees([]);
      setMessage("");
      setLogin(false);
      try {
        const inspectResponse = await fetch(
          `/api/permissions/inspect?resourceId=${encodeURIComponent(resourceId)}`,
          { cache: "no-store", signal: inspectController.signal },
        );
        const inspectValue = await inspectResponse.json();
        if (!active) return;
        if (inspectResponse.ok) {
          if (!inspectValue?.inspection) {
            setMessage("Không thể xem quyền của nội dung này.");
          } else {
            setResult(inspectValue.inspection);
          }
        } else if (inspectResponse.status === 401) {
          setLogin(true);
          setMessage("Vui lòng đăng nhập để kiểm tra quyền của bạn.");
        } else if (inspectResponse.status === 404 || inspectResponse.status === 400)
          setMessage("Không thể xem quyền của nội dung này.");
        else if (inspectResponse.status === 429)
          setMessage("Bạn đã kiểm tra nhiều lần. Vui lòng thử lại sau.");
        else setMessage("Chưa thể kiểm tra quyền. Vui lòng thử lại.");
      } catch {
        if (active)
          setMessage("Không thể kết nối. Vui lòng thử lại.");
      }
      try {
        const grantsResponse = await fetch(
          `/api/permissions/grants?resourceId=${encodeURIComponent(resourceId)}`,
          { cache: "no-store", signal: grantsController.signal },
        );
        const grantsValue = await grantsResponse.json();
        if (!active) return;
        if (grantsResponse.ok && grantsValue?.grants)
          setGrantees(grantsValue.grants);
      } catch {
        // Danh sách người được chia sẻ là thông tin bổ trợ; không chặn hiển thị vai trò.
      } finally {
        if (active) setBusy(false);
      }
    }
    void run();
    return () => {
      active = false;
      inspectController.abort();
      grantsController.abort();
    };
  }, [resourceId]);
  useEffect(() => load(), [load]);
  return (
    <section
      className="account-card"
      aria-labelledby="permission-title"
      aria-busy={busy}
    >
      <h1 id="permission-title">Quyền của bạn</h1>
      <p>Kiểm tra vai trò hiện tại đối với nội dung này.</p>
      <div role="status">{busy ? "Đang kiểm tra quyền…" : message}</div>
      {result && (
        <div>
          <h2>{roles[result.role as keyof typeof roles] ?? result.role}</h2>
          <p>
            {result.read_reason === "source_deleted"
              ? "Nội dung đã bị xóa."
              : result.read_reason === "domain_conditions_required"
                ? "Nội dung có điều kiện truy cập riêng; vai trò này không cho phép mở trước điều kiện."
                : result.base_read_allowed
                  ? "Quyền cơ bản cho phép xem."
                  : "Hiện chưa được phép xem."}
          </p>
          <p>
            Các điều kiện riêng của nội dung vẫn áp dụng. Vai trò này không tự
            cho phép phê duyệt, mở thư hẹn giờ hoặc xuất dữ liệu.
          </p>
        </div>
      )}
      {grantees.length > 0 && (
        <div>
          <h2>Ai đang có quyền trên nội dung này</h2>
          <ul>
            {grantees.map((g) => (
              <li key={g.grant_id}>
                {g.recipient_name ?? g.recipient_id} — {roles[g.role as keyof typeof roles] ?? g.role}
              </li>
            ))}
          </ul>
          <p className="field-help">
            Danh sách chỉ bao gồm người bạn đã cho phép và được hệ thống xác nhận.
          </p>
        </div>
      )}
      {result?.role === "owner" && (
        <SharingPanel
          key={resourceId}
          resourceId={resourceId}
          onChanged={() => load()}
        />
      )}
      {login && <Link href="/account">Đăng nhập</Link>}
      <button type="button" disabled={busy} onClick={() => load()}>
        Kiểm tra lại
      </button>
    </section>
  );
}
