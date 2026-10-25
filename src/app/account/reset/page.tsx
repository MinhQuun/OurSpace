import Link from "next/link";
import ResetForm from "./reset-form";
export default function ResetPage() {
  return (
    <main className="account-page">
      <Link href="/account">Tài khoản</Link>
      <ResetForm />
    </main>
  );
}
