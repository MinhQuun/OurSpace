import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
/** Synthetic local Storage only; never print the resulting token. */
export function localStorageToken() {
 const now=Math.floor(Date.now()/1000);
 const data=[{alg:"HS256",typ:"JWT"},{role:"service_role",iat:now,exp:now+900}]
  .map(value=>Buffer.from(JSON.stringify(value)).toString("base64url")).join(".");
 return data+"."+createHmac("sha256",readFileSync(".local/storage-jwt-secret","utf8").trim()).update(data).digest("base64url");
}
