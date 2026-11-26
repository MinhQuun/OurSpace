import "server-only";
import { createHash } from "node:crypto";
import sharp from "sharp";
import type { createDatabase } from "../../../server/database.server";
import type { PrivateStorage } from "../../../server/private-storage.server";
import { validateImage, type ImageLimits } from "./validate-image";
type Source={media_id:string;mime_type:string;bucket:string;object_key:string;byte_size:string;sha256:string};
export class MediaPreviewService {
 private readonly limits:Readonly<ImageLimits>;
 constructor(private readonly db:ReturnType<typeof createDatabase>,private readonly storage:PrivateStorage,limits:ImageLimits,private readonly maxEdge:number){
  if(![limits.maxBytes,limits.maxPixels,limits.timeoutSeconds,maxEdge].every(n=>Number.isSafeInteger(n)&&n>0)||maxEdge>4096)throw new Error("Invalid preview configuration");
  this.limits=Object.freeze({...limits});
 }
 async read(session:string,mediaId:string,signal?:AbortSignal):Promise<Buffer|null>{
  if(!/^[A-Za-z0-9_-]{43}$/.test(session)||Buffer.from(session,"base64url").toString("base64url")!==session||!/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(mediaId)||signal?.aborted)return null;
  const hash=createHash("sha256").update(session).digest("hex");
  const resolve=async()=>(await this.db.query<Source>("SELECT * FROM app_internal.read_media_preview_source($1,$2)",[hash,mediaId])).rows[0];
  const first=await resolve();if(!first)return null;
  const size=Number(first.byte_size);if(!Number.isSafeInteger(size)||size<1||size>this.limits.maxBytes)throw new Error("Preview unavailable");
  const bytes=await this.storage.read({...first,byte_size:size},signal);
  await validateImage(bytes,first.mime_type,this.limits);
  if(signal?.aborted)return null;
  // First-frame thumbnail only. Sharp strips metadata unless explicitly retained.
  const preview=await sharp(bytes,{failOn:"warning",limitInputPixels:this.limits.maxPixels,animated:false})
   .timeout({seconds:this.limits.timeoutSeconds}).rotate()
   .resize({width:this.maxEdge,height:this.maxEdge,fit:"inside",withoutEnlargement:true})
   .webp({quality:80}).toBuffer();
  const current=await resolve();
  if(!current||JSON.stringify(first)!==JSON.stringify(current)||signal?.aborted)return null;
  return preview;
 }
}
