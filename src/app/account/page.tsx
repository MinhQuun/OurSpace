import AccountForm from "./account-form";
import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="account-page">
      <Link className="eyebrow" href="/">
        OUR SPACE
      </Link>
      <AccountForm />
      <Link href="/account/pairing">Ghép đôi</Link>
      <Link href="/account/reset">Quên mật khẩu?</Link>
      <Link href="/account/security">Cài đặt xác thực hai bước</Link>
    </main>
  );
}
