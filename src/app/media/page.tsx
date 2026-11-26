import Link from "next/link";
import Gallery from "./gallery";

export default function MediaPage() {
  return <main className="account-page">
    <h1>Our Memories</h1>
    <p>Media mới thêm, theo thứ tự tải lên gần nhất.</p>
    <Link href="/media/upload">Tải ảnh lên</Link>
    <Gallery />
  </main>;
}
