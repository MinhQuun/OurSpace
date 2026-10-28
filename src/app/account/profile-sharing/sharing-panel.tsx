"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
type Space = { id: string; state: string; partner_id: string; partner_name: string | null };
type Grant = { id: string; field: string; space_id: string; revoked_at: string | null };
type Snapshot = { version: number; spaces: Space[]; grants: Grant[] };
const fields: Record<string, string> = { display_name: "Tên hiển thị", nickname: "Biệt danh", birthday: "Ngày sinh", bio: "Giới thiệu", avatar_ref: "Ảnh đại diện" };
export default function SharingPanel() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const commands = useRef(new Map<string, string>());
  const check = useCallback(async (response: Response) => {
    if (response.status === 401) { setExpired(true); setData(null); throw new Error("Phiên đã hết hiệu lực."); }
    if (response.status === 429) throw new Error("Bạn thao tác quá nhanh. Hãy chờ một lúc rồi thử lại.");
    if (response.status === 409) throw new Error("Hồ sơ hoặc quyền đã thay đổi. Hãy làm mới và kiểm tra trước khi xác nhận lại.");
    if (!response.ok) throw new Error("Không thể thực hiện. Hãy làm mới và kiểm tra trạng thái liên kết.");
    return response.json();
  }, []);
  const refresh = useCallback(async (signal?: AbortSignal) => {
    setData(null);
    const [profile, spaces, grants] = await Promise.all([
      fetch("/api/profile", { cache: "no-store", signal }).then(check),
      fetch("/api/spaces/list", { cache: "no-store", signal }).then(check),
      fetch("/api/profile/grants", { cache: "no-store", signal }).then(check),
    ]);
    if (!signal?.aborted) setData({ version: Number(profile.profile.version), spaces: spaces.spaces, grants: grants.grants });
  }, [check]);
  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => refresh(controller.signal)).catch(error => { if (!controller.signal.aborted) { setFailed(true); setMessage(error.message); } });
    return () => controller.abort();
  }, [refresh]);
  async function mutate(event: FormEvent<HTMLFormElement>, grant?: Grant) {
    event.preventDefault();
    if (!data || busy) return;
    const form = new FormData(event.currentTarget);
    if (form.get("confirmed") !== "on") return;
    const space = data.spaces.find(item => item.id === form.get("space"));
    if (!grant && (!space || space.state !== "active")) return;
    const payload = grant ? { grantId: grant.id, version: data.version, confirmed: true }
      : { spaceId: space!.id, recipientId: space!.partner_id, field: form.get("field"), version: data.version, confirmed: true };
    const key = JSON.stringify(payload);
    const commandId = commands.current.get(key) ?? crypto.randomUUID();
    commands.current.set(key, commandId);
    setBusy(true); setMessage(""); setFailed(false);
    try {
      await check(await fetch(`/api/profile/${grant ? "revoke" : "share"}`, {
        method: "POST", headers: { "Content-Type": "application/json", Origin: window.location.origin },
        body: JSON.stringify({ ...payload, commandId }),
      }));
      await refresh();
      setMessage(grant ? "Đã thu hồi quyền xem trường hồ sơ." : "Đã chia sẻ trường hồ sơ đã chọn.");
    } catch (error) { setFailed(true); setMessage(error instanceof Error ? error.message : "Không thể kết nối. Hãy thử lại."); }
    finally { setBusy(false); }
  }
  return <section className="account-card" aria-busy={busy}>
    <h1>Chia sẻ hồ sơ cá nhân</h1>
    <p>Chỉ các trường bạn xác nhận mới được chia sẻ. Chia sẻ hồ sơ không cấp quyền xem ảnh nguồn.</p>
    {message && <p role={failed ? "alert" : "status"}>{message}</p>}
    {expired ? <Link href="/account">Đăng nhập lại</Link> : <>
      <button className="button" disabled={busy} onClick={async () => { setBusy(true); setMessage(""); try { await refresh(); } catch (error) { setFailed(true); setMessage(error instanceof Error ? error.message : "Không thể tải."); } finally { setBusy(false); } }}>Làm mới quyền hồ sơ</button>
      {!data ? <p>Chưa có dữ liệu hồ sơ để hiển thị.</p> : <>
        {data.spaces.some(space => space.state === "active") ? <form key={data.version} className="account-form" onSubmit={event => mutate(event)}>
          <label className="field">Chia sẻ với<select name="space" required>{data.spaces.filter(space => space.state === "active").map(space => <option key={space.id} value={space.id}>{space.partner_name ?? "Partner"}</option>)}</select></label>
          <label className="field">Trường hồ sơ<select name="field" required>{Object.entries(fields).filter(([field]) => field !== "avatar_ref").map(([field, label]) => <option key={field} value={field}>{label}</option>)}</select></label>
          <label><input type="checkbox" name="confirmed" required /> Tôi xác nhận chia sẻ trường đã chọn với Partner này.</label>
          <button className="button primary" disabled={busy}>Chia sẻ trường</button>
        </form> : <p>Chưa có liên kết đang hoạt động để chia sẻ mới.</p>}
        <h2>Quyền đã cấp</h2>
        {data.grants.filter(grant => !grant.revoked_at).length === 0 && <p>Chưa chia sẻ trường nào.</p>}
        {data.grants.filter(grant => !grant.revoked_at).map(grant => <form key={grant.id} className="account-form" onSubmit={event => mutate(event, grant)}>
          <p>{fields[grant.field]} — {data.spaces.find(space => space.id === grant.space_id)?.partner_name ?? "Partner của liên kết trước"}</p>
          <label><input type="checkbox" name="confirmed" required /> Xác nhận thu hồi {fields[grant.field]}</label>
          <button className="button" disabled={busy}>Thu hồi {fields[grant.field]}</button>
        </form>)}
      </>}
    </>}
  </section>;
}
