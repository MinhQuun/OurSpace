import AccountForm from "./account-form";
import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="account-page">
      <Link className="eyebrow" href="/">
        OUR SPACE
      </Link>
      <AccountForm />
      <Link href="/account/couple">Hồ sơ chung</Link>
      <Link href="/account/partner">Hồ sơ Partner</Link>
      <Link href="/account/profile-sharing">Chia sẻ hồ sơ cá nhân</Link>
      <Link href="/account/settings">Cài đặt hiển thị</Link>
      <Link href="/account/notifications">Thông báo</Link>
      <Link href="/account/spaces">Space và ngừng liên kết</Link>
      <Link href="/account/pairing">Ghép đôi</Link>
      <Link href="/account/reset">Quên mật khẩu?</Link>
      <Link href="/account/security">Cài đặt xác thực hai bước</Link>
    </main>
  );
}
