"use client";
import { useRef, useState } from "react";
type Pending={uploadId:string;title:string;mimeType:string;byteSize:number;sha256:string};
export default function RecoveryPanel({disabled,onRecover,onSignedOut}:{disabled:boolean;onRecover:(id:string,file:File)=>void;onSignedOut:()=>void}){
 const [items,setItems]=useState<Pending[]>([]),[cursor,setCursor]=useState<string|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const locked=useRef(false);
 async function load(after?:string){
  if(locked.current)return;locked.current=true;setBusy(true);setMessage("");
  try{const response=await fetch("/api/media/upload"+(after?"?after="+after:""),{cache:"no-store"});
   if(response.status===401){setItems([]);onSignedOut();return;}if(!response.ok)throw new Error();
   const result=await response.json();setItems(old=>after?[...old,...result.items]:result.items);setCursor(result.nextCursor);
   if(!after&&!result.items.length)setMessage("Không có upload nào cần phục hồi.");
  }catch{setMessage("Chưa đọc được danh sách. Hãy thử lại.");}finally{locked.current=false;setBusy(false);}
 }
 async function choose(item:Pending,file?:File){
  if(!file||locked.current)return;locked.current=true;setBusy(true);setMessage("");
  try{
   const response=await fetch("/api/media/upload?uploadId="+item.uploadId,{cache:"no-store"});
   if(response.status===401){setItems([]);onSignedOut();return;}if(!response.ok)throw new Error();
   if((await response.json()).state==="completed"){setItems(old=>old.filter(i=>i.uploadId!==item.uploadId));setMessage("Ảnh này đã được lưu; không cần tải lại.");return;}
   if(file.size!==item.byteSize){setMessage("File đã chọn không khớp bản đang phục hồi.");return;}
   const digest=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",await file.arrayBuffer())),b=>b.toString(16).padStart(2,"0")).join("");
   if(digest!==item.sha256){setMessage("File đã chọn không khớp bản đang phục hồi.");return;}
   onRecover(item.uploadId,file);setItems(old=>old.filter(i=>i.uploadId!==item.uploadId));setMessage("Đã thêm vào hàng đợi. Bạn có thể tiếp tục tải.");
  }catch{setMessage("Chưa phục hồi được file. Hãy thử lại.");}finally{locked.current=false;setBusy(false);}
 }
 return <section aria-label="Phục hồi upload">
  <h2>Tiếp tục upload trước đó</h2>
  <p>Phiên đã tạo trên server có thể phục hồi bằng cách chọn lại đúng file. File mới chỉ nằm trong hàng đợi của trang thì cần chọn lại từ đầu.</p>
  <button disabled={disabled||busy} onClick={()=>void load()}>Tìm upload chưa hoàn tất</button>
  {message&&<p role="status">{message}</p>}
  <ul>{items.map(item=><li key={item.uploadId}><strong>{item.title}</strong>
   <label>Chọn lại {item.title}<input type="file" disabled={disabled||busy} onChange={event=>{const file=event.target.files?.[0];event.target.value="";void choose(item,file);}}/></label>
  </li>)}</ul>
  {cursor&&<button disabled={disabled||busy} onClick={()=>void load(cursor)}>Xem thêm phiên upload</button>}
 </section>;
}
