"use client";
import { useEffect, useRef, useState } from "react";
import RecoveryPanel from "./recovery-panel";
import styles from "./upload.module.css";
type Candidate={mediaId:string;title:string;mimeType:string};
type Item={id:string;file:File;state:"queued"|"checking"|"uploading"|"processing"|"completed"|"failed"|"cancelled"|"reused"|"duplicate";candidates?:Candidate[];nextCursor?:string|null;progress:number;uploadId?:string;error?:string};
const labels={queued:"Đang chờ",checking:"Đang kiểm tra",uploading:"Đang tải",processing:"Đang xác minh",completed:"Đã lưu riêng tư",failed:"Chưa tải được",cancelled:"Đã hủy",reused:"Đã dùng bản có sẵn",duplicate:"Cần chọn cách xử lý file trùng"};
class UploadError extends Error { constructor(public status:number){super("Upload failed");} }
export default function UploadQueue(){
 const [items,setItems]=useState<Item[]>([]),[busy,setBusy]=useState(false),[signedOut,setSignedOut]=useState(false),[pauseRequested,setPauseRequested]=useState(false);
 const stopAfterCurrent=useRef(false);
 const queue=useRef<Item[]>([]),running=useRef(false),alive=useRef(true),xhr=useRef<XMLHttpRequest|null>(null);
 const publish=()=>{if(alive.current)setItems(queue.current.map(i=>({...i})));};
 useEffect(()=>{alive.current=true; const warn=(event:BeforeUnloadEvent)=>{if(queue.current.some(i=>i.state!=="completed"&&i.state!=="reused"&&i.state!=="cancelled")){event.preventDefault();event.returnValue="";}};
 window.addEventListener("beforeunload",warn);return()=>{alive.current=false;xhr.current?.abort();window.removeEventListener("beforeunload",warn);};},[]);
 async function json(url:string,options?:RequestInit){
  const response=await fetch(url,{...options,cache:"no-store"});if(!response.ok)throw new UploadError(response.status);return response.json();
 }
 function send(item:Item){return new Promise<void>((resolve,reject)=>{
  const request=new XMLHttpRequest();xhr.current=request;request.open("PUT","/api/media/upload?uploadId="+item.uploadId);
  request.setRequestHeader("Content-Type","application/octet-stream");
  request.upload.onprogress=event=>{if(event.lengthComputable){item.progress=Math.round(event.loaded/event.total*100);item.state=item.progress===100?"processing":"uploading";publish();}};
  request.onload=()=>request.status===200?resolve():reject(new UploadError(request.status));
  request.onerror=()=>reject(new UploadError(0));request.onabort=()=>reject(new UploadError(0));request.send(item.file);
 });}
 async function run(only?:string){
  if(running.current)return;running.current=true;stopAfterCurrent.current=false;setPauseRequested(false);setBusy(true);
  try {for(const item of queue.current){
   if(!alive.current||stopAfterCurrent.current)break;
   if(item.state==="completed" || item.state==="reused" || item.state==="cancelled" || (only?item.id!==only:item.state!=="queued"))continue;
   item.error=undefined;item.state="checking";publish();
   try {
    let separate=false;
    if(item.uploadId){const status=await json("/api/media/upload?uploadId="+item.uploadId);separate=status.separate===true;if(status.state==="cancelled"){item.state="cancelled";publish();continue;}if(status.state==="completed"||status.state==="reused"){item.state=status.state;item.progress=100;publish();continue;}}
    if(!item.uploadId){
     const buffer=await item.file.arrayBuffer();
     const sha256=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",buffer)),b=>b.toString(16).padStart(2,"0")).join("");
     const result=await json("/api/media/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({commandId:item.id,title:item.file.name,mimeType:item.file.type,byteSize:item.file.size,sha256})});item.uploadId=result.uploadId;
    }
    if(!alive.current)break;
    if(!separate){
     const matches=await json("/api/media/upload?uploadId="+item.uploadId+"&duplicates=true");
     if(matches.items.length){item.candidates=matches.items;item.nextCursor=matches.nextCursor;item.state="duplicate";publish();continue;}
    }
    item.state="uploading";item.progress=0;publish();await send(item);item.state="completed";item.progress=100;
   }catch(error){
    const status=error instanceof UploadError?error.status:0;
    if(status===401){queue.current=[];setSignedOut(true);publish();break;}
    item.state="failed";item.error=status===400?"File không hợp lệ hoặc định dạng chưa được hỗ trợ.":status===413?"File vượt giới hạn tải lên.":status===429?"Đã đạt giới hạn yêu cầu. Hãy thử lại sau.":"Không thể hoàn tất. Thử lại sẽ kiểm tra bản đã lưu trước.";
   }publish();
  }}finally{running.current=false;xhr.current=null;if(alive.current)setBusy(false);}
 }
 async function decide(id:string,mediaId?:string){
  const item=queue.current.find(entry=>entry.id===id);if(!item||running.current)return;
  running.current=true;setBusy(true);item.error=undefined;
  try{
   const result=await json("/api/media/upload?uploadId="+item.uploadId,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(mediaId?{mediaId,confirmed:true}:{mode:"separate",confirmed:true})});
   item.candidates=undefined;item.nextCursor=null;
   item.state=result.state==="reused"?"reused":result.state==="completed"?"completed":"queued";
   if(item.state==="reused"||item.state==="completed")item.progress=100;
  }catch(error){
   if(error instanceof UploadError&&error.status===401){queue.current=[];setSignedOut(true);}
   else{item.state="failed";item.candidates=undefined;item.error="Chưa xác nhận được lựa chọn. Thử lại để kiểm tra quyền và trạng thái mới nhất.";}
  }finally{running.current=false;setBusy(false);publish();}
 }
 async function moreCandidates(id:string){
  const item=queue.current.find(entry=>entry.id===id);if(!item?.nextCursor||running.current)return;
  running.current=true;setBusy(true);item.error=undefined;
  try{const result=await json("/api/media/upload?uploadId="+item.uploadId+"&duplicates=true&after="+item.nextCursor);
   item.candidates=[...(item.candidates??[]),...result.items];item.nextCursor=result.nextCursor;
  }catch(error){if(error instanceof UploadError&&error.status===401){queue.current=[];setSignedOut(true);}else item.error="Chưa đọc được thêm kết quả. Hãy thử lại.";
  }finally{running.current=false;setBusy(false);publish();}
 }
 async function cancel(id:string){
  const item=queue.current.find(entry=>entry.id===id);if(!item)return;
  if(running.current)return;running.current=true;setBusy(true);item.error=undefined;
  try{if(item.uploadId)await json("/api/media/upload?uploadId="+item.uploadId,{method:"DELETE"});item.state="cancelled";}
  catch(error){const status=error instanceof UploadError?error.status:0;
   if(status===401){queue.current=[];setSignedOut(true);}
   else if(status===409){item.state="completed";item.progress=100;}
   else item.error="Chưa hủy được. Hãy thử lại; file đã lưu không bị xóa.";
  }finally{running.current=false;setBusy(false);publish();}
 }
 if(signedOut)return <p role="alert">Phiên đăng nhập đã kết thúc. <a href="/account">Đăng nhập lại</a></p>;
 return <section aria-label="Hàng đợi tải ảnh" className={styles.queue}>
  <p>Ảnh được lưu riêng tư. Chọn nhiều ảnh JPEG, PNG hoặc WebP; từng file được xử lý độc lập.</p>
  <p>HEIC và video chưa có trong luồng tải này. Sau khi tải lại trang, bạn có thể phục hồi các phiên đã tạo trên server bằng cách chọn lại file.</p>
  <RecoveryPanel disabled={busy} onSignedOut={()=>{queue.current=[];setSignedOut(true);publish();}} onRecover={(id,file)=>{
   if(!queue.current.some(item=>item.uploadId===id))queue.current.push({id:crypto.randomUUID(),file,uploadId:id,state:"queued",progress:0});publish();
  }}/>
  <label>Chọn ảnh<input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event=>{
   queue.current.push(...Array.from(event.target.files??[]).map(file=>({id:crypto.randomUUID(),file,state:"queued" as const,progress:0})));publish();event.target.value="";
  }}/></label>
  <button disabled={busy||!items.some(i=>i.state==="queued")} onClick={()=>void run()}>Tải các ảnh đang chờ</button>
  <button disabled={!busy||pauseRequested||!items.some(i=>["checking","uploading","processing"].includes(i.state))} onClick={()=>{stopAfterCurrent.current=true;setPauseRequested(true);}}>Tạm dừng sau file hiện tại</button>
  {pauseRequested&&<p>{busy?"Đang hoàn tất file hiện tại trước khi dừng.":"Đã dừng hàng đợi. Chọn tải các ảnh đang chờ để tiếp tục."}</p>}
  <p role="status">{items.filter(i=>i.state==="completed"||i.state==="reused").length} đã lưu · {items.filter(i=>i.state==="failed").length} lỗi · {items.filter(i=>i.state==="queued").length} đang chờ</p>
  {items.some(i=>i.state==="duplicate")&&<p>{items.filter(i=>i.state==="duplicate").length} file cần xử lý trùng.</p>}
  <ul>{items.map(item=><li key={item.id}>
   <strong>{item.file.name}</strong><span>{labels[item.state]}</span>
   <progress value={item.progress} max={100} aria-label={"Tiến độ "+item.file.name}/>
   {item.error&&<p>{item.error}</p>}
   {item.state==="duplicate"&&<div>
    <p>Nội dung trùng với media bạn có quyền dùng. Chọn bản có sẵn hoặc xác nhận tạo media riêng tư mới; hủy sẽ giữ nguyên media cũ.</p>
    <ul>{item.candidates?.map(candidate=><li key={candidate.mediaId}><button disabled={busy} onClick={()=>void decide(item.id,candidate.mediaId)}>Dùng bản có sẵn: {candidate.title}</button></li>)}</ul>
    {item.nextCursor&&<button disabled={busy} onClick={()=>void moreCandidates(item.id)}>Xem thêm bản trùng</button>}
    <button disabled={busy} onClick={()=>void decide(item.id)}>Xác nhận tạo bản riêng</button>
   </div>}
   {item.state==="failed"&&<button disabled={busy} onClick={()=>void run(item.id)}>Thử lại</button>}
   {(item.state==="queued"||item.state==="failed"||item.state==="duplicate")&&<button disabled={busy} onClick={()=>void cancel(item.id)}>Hủy upload</button>}
  </li>)}</ul>
 </section>;
}
