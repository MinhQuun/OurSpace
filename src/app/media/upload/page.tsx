import Link from "next/link";
import UploadQueue from "./upload-queue";
export default function UploadPage() {
 return <main className="account-page"><h1>Tải ảnh lên</h1><Link href="/media">Về thư viện</Link><UploadQueue /></main>;
}
