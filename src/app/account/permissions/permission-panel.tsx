"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SharingPanel from "./sharing-panel";
import type { BasePermissionInspection } from "../../../modules/m10/permissions/service.server";
const roles = {
  owner: "Chủ sở hữu",
  editor: "Người chỉnh sửa",
  commenter: "Người bình luận",
  viewer: "Người xem",
};
export default function PermissionPanel({
  resourceId,
}: {
  resourceId: string;
}) {
  const [result, setResult] = useState<BasePermissionInspection | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(true);
  const [retry, setRetry] = useState(0);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    async function inspect() {
      setBusy(true);
      setResult(null);
      setMessage("");
      setLogin(false);
      try {
        const response = await fetch(
          `/api/permissions/inspect?resourceId=${encodeURIComponent(resourceId)}`,
          { cache: "no-store", signal: controller.signal },
        );
        const value = await response.json();
        if (controller.signal.aborted) return;
        if (response.ok) setResult(value.inspection);
        else if (response.status === 401) {
          setLogin(true);
          setMessage("Vui lòng đăng nhập để kiểm tra quyền của bạn.");
        } else if (response.status === 404 || response.status === 400)
          setMessage("Không thể xem quyền của nội dung này.");
        else if (response.status === 429)
          setMessage("Bạn đã kiểm tra nhiều lần. Vui lòng thử lại sau.");
        else setMessage("Chưa thể kiểm tra quyền. Vui lòng thử lại.");
      } catch {
        if (!controller.signal.aborted)
          setMessage("Không thể kết nối. Vui lòng thử lại.");
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }
    void inspect();
    return () => controller.abort();
  }, [resourceId, retry]);
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
          <h2>{roles[result.role]}</h2>
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
      {result?.role === "owner" && (
        <SharingPanel
          key={`${resourceId}:${retry}`}
          resourceId={resourceId}
          onChanged={() => setRetry((value) => value + 1)}
        />
      )}
      {login && <Link href="/account">Đăng nhập</Link>}
      <button
        type="button"
        disabled={busy}
        onClick={() => setRetry((value) => value + 1)}
      >
        Kiểm tra lại
      </button>
    </section>
  );
}
