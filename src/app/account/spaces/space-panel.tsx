"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
type Space = { id:string; state:string; version:string; partner_id:string; partner_name:string|null; disconnected_at:string|null; processing_until:string|null };
const labels: Record<string,string> = { active:"Đang liên kết", disconnecting:"Đang ngừng liên kết", frozen:"Đã ngừng liên kết", archived:"Đã lưu trữ", closed:"Đã đóng" };
async function failure(response: Response): Promise<never> {
  if (response.status === 429) {
    const seconds=Number(response.headers.get("Retry-After"));
    throw new Error(Number.isSafeInteger(seconds)&&seconds>0&&seconds<=86400 ? `Bạn thao tác quá nhanh. Hãy chờ ${seconds} giây rồi thử lại.` : "Hãy chờ một lúc rồi thử lại.");
  }
  const data=await response.json().catch(()=>({}));
  if (data.error === "mfa_required") throw new Error("Tài khoản cần mã TOTP hoặc mã khôi phục để xác thực lại.");
  if (response.status===401) throw new Error("Phiên đã hết hiệu lực. Hãy đăng nhập lại.");
  if (response.status===409) throw new Error("Trạng thái đã thay đổi. Hãy làm mới trước khi tiếp tục.");
  throw new Error("Không thể thực hiện. Kiểm tra thông tin xác thực và làm mới trạng thái trước khi thử lại.");
}
export default function SpacePanel() {
  const [spaces,setSpaces]=useState<Space[]>([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [signedIn,setSignedIn]=useState(true);
  const [message,setMessage]=useState("");
  const [failed,setFailed]=useState(false);
  const commands=useRef(new Map<string,string>());
  const refresh=useCallback(async()=>{
    const response=await fetch("/api/spaces/list",{cache:"no-store"});
    if(response.status===401){setSpaces([]);setSignedIn(false);return;}
    if(!response.ok){setSpaces([]);await failure(response);}
    setSignedIn(true);setSpaces((await response.json()).spaces);
  },[]);
  useEffect(()=>{let disposed=false;Promise.resolve().then(refresh).catch(error=>{if(!disposed){setFailed(true);setMessage(error.message);}}).finally(()=>{if(!disposed)setLoading(false);});return()=>{disposed=true;};},[refresh]);
  async function reload(){setBusy(true);setMessage("");setFailed(false);try{await refresh();}catch(error){setFailed(true);setMessage(error instanceof Error?error.message:"Chưa thể tải trạng thái.");}finally{setBusy(false);}}
  async function disconnect(event:FormEvent<HTMLFormElement>,space:Space){
    event.preventDefault();if(busy)return;
    const form=event.currentTarget;const data=new FormData(form);
    setBusy(true);setMessage("");setFailed(false);
    const key=`${space.id}:${space.version}`;
    if(!commands.current.has(key))commands.current.set(key,crypto.randomUUID());
    try{
      const code=String(data.get("code")??"").trim();
      const response=await fetch("/api/spaces/disconnect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        spaceId:space.id,version:Number(space.version),commandId:commands.current.get(key),confirmed:data.get("confirmed")==="on",
        email:data.get("email"),password:data.get("password"),...(code?{factor:{method:data.get("method"),code}}:{})
      })});
      if(!response.ok)await failure(response);
      await refresh();setMessage("Đã ngừng liên kết. Trạng thái và thời hạn xử lý được hiển thị bên dưới.");
    }catch(error){setFailed(true);setMessage(error instanceof Error?error.message:"Mất kết nối. Hãy làm mới để kiểm tra kết quả.");}
    finally{form.reset();setBusy(false);}
  }
  return <section className="account-card mfa-settings space-panel" aria-busy={loading||busy}>
    <h1>Space của bạn</h1>
    <p>Ngừng liên kết không xóa tài khoản hoặc dữ liệu cá nhân của người còn lại. Một người có thể ngừng liên kết sau khi xác thực lại, không cần người kia chấp thuận.</p>
    {message&&<p role={failed?"alert":"status"} className="form-message">{message}</p>}
    {loading?<p>Đang tải…</p>:!signedIn?<Link href="/account">Đăng nhập để tiếp tục</Link>:<>
      <button disabled={busy} onClick={()=>void reload()}>Làm mới trạng thái</button>
      {!spaces.length&&<p>Bạn chưa có Space. <Link href="/account/pairing">Ghép đôi</Link></p>}
      {spaces.map(space=><article key={space.id} className="pairing-invitation">
        <h2>{labels[space.state]??"Không khả dụng"}</h2>
        <p>Người còn lại: <strong>{space.partner_name??"Không khả dụng"}</strong><br/><small>{space.partner_id}</small></p>
        <p>Space: <small>{space.id}</small></p>
        {space.processing_until&&<p>Thời hạn xử lý: {new Date(space.processing_until).toLocaleString("vi-VN")}. Nội dung chung chỉ được truy cập theo quyền của từng đối tượng.</p>}
        {space.state==="active"&&<form onSubmit={event=>void disconnect(event,space)}>
          <p>Space sẽ ngừng cộng tác mới và chuyển sang giai đoạn xử lý 30 ngày. Lời mời đang chờ bị thu hồi. Nội dung Private vẫn thuộc từng người.</p>
          <fieldset disabled={busy}>
            <label>Email của bạn<input name="email" type="email" autoComplete="username" required maxLength={320}/></label>
            <label>Mật khẩu hiện tại<input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>
            <label>Phương thức MFA<select name="method" defaultValue="totp"><option value="totp">TOTP</option><option value="recovery">Mã khôi phục</option></select></label>
            <label>Mã MFA (nếu đã bật)<input name="code" autoComplete="one-time-code" maxLength={64}/></label>
            <label><input name="confirmed" type="checkbox" required/> Tôi đã kiểm tra đúng Space và hiểu tác động; tôi muốn ngừng liên kết.</label>
            <button>Ngừng liên kết</button>
          </fieldset>
        </form>}
      </article>)}
      <p>Hiển thị tối đa 100 Space gần nhất. Làm mới để xem thay đổi từ người kia.</p>
    </>}
  </section>;
}
