import Link from "next/link";
import MfaSettings from "./settings";

export default function SecurityPage() {
  return (
    <main className="account-page">
      <Link className="eyebrow" href="/account">
        Tài khoản
      </Link>
      <MfaSettings />
    </main>
  );
}
