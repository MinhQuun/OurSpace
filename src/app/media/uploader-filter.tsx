"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Choice = {id:string;isSelf:boolean;displayName:string|null};
export default function UploaderFilter({value,change,disabled}:{value:string;change:(value:string)=>void;disabled:boolean}) {
  const [choices,setChoices]=useState<Choice[]>([]);
  const [cursor,setCursor]=useState<string|null>(null);
  const [busy,setBusy]=useState(true);
  const [error,setError]=useState(false);
  const request=useRef<AbortController|null>(null);
  const load=useCallback(async(after:string|null=null)=>{
    request.current?.abort();
    const controller=new AbortController(); request.current=controller;
    setBusy(true);setError(false);
    if(!after){setChoices([]);setCursor(null);}
    try {
      const response=await fetch(`/api/media/uploaders${after?`?after=${encodeURIComponent(after)}`:""}`,{cache:"no-store",credentials:"same-origin",signal:controller.signal});
      if(!response.ok)throw new Error("choices unavailable");
      const data=await response.json() as {uploaders:Choice[];nextCursor:string|null};
      if(controller.signal.aborted)return;
      setChoices(previous=>after?[...previous,...data.uploaders.filter(item=>!previous.some(old=>old.id===item.id))]:data.uploaders);
      setCursor(data.nextCursor);
    }catch{if(!controller.signal.aborted){setChoices([]);setCursor(null);setError(true);}}
    finally{if(!controller.signal.aborted)setBusy(false);}
  },[]);
  useEffect(()=>{
    const timer=window.setTimeout(()=>void load(),0);
    const visibility=()=>{
      if(document.visibilityState==="hidden") {request.current?.abort();setChoices([]);setCursor(null);setBusy(true);}
      else void load();
    };
    window.addEventListener("pageshow",visibility);document.addEventListener("visibilitychange",visibility);
    return()=>{window.clearTimeout(timer);request.current?.abort();window.removeEventListener("pageshow",visibility);document.removeEventListener("visibilitychange",visibility);};
  },[load]);
  return <fieldset disabled={disabled}>
    <legend>Người tải lên</legend>
    <select aria-label="Người tải lên" value={value} onChange={event=>change(event.target.value)}>
      <option value="">Tất cả người tải lên</option>
      {value&&!choices.some(item=>item.id===value)&&<option value={value}>Người đã chọn (chưa xác minh lại)</option>}
      {choices.map((item,index)=><option key={item.id} value={item.id}>{item.isSelf?"Tôi":item.displayName??`Người tải lên ${index+1} (chưa chia sẻ tên)`}</option>)}
    </select>
    {busy&&<p>Đang tải lựa chọn người tải lên…</p>}
    {error&&<p role="alert">Không tải được lựa chọn người tải lên. Bộ lọc hiện tại vẫn được giữ.</p>}
    <button type="button" disabled={busy} onClick={()=>void load()}>Làm mới người tải lên</button>
    {cursor&&!error&&<button type="button" disabled={busy} onClick={()=>void load(cursor)}>Thêm người tải lên</button>}
  </fieldset>;
}
