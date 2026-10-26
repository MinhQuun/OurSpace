import Link from "next/link";
import PairingPanel from "./pairing-panel";
export default function PairingPage() {
  return (
    <main className="account-page">
      <Link href="/account">Tài khoản</Link>
      <PairingPanel />
    </main>
  );
}
