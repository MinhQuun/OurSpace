import Link from "next/link";
import SharingPanel from "./sharing-panel";
export default function ProfileSharingPage() {
  return <main className="account-page"><Link href="/account">Tài khoản</Link><SharingPanel /></main>;
}
