import Link from "next/link";
import SpacePanel from "./space-panel";
export default function SpacesPage() {
  return (
    <main className="account-page">
      <Link href="/account">Tài khoản</Link>
      <SpacePanel />
    </main>
  );
}
