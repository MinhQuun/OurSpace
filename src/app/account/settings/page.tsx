import Link from "next/link";
import PreferencesPanel from "./preferences-panel";

export default function SettingsPage() {
  return (
    <main className="account-page">
      <Link className="eyebrow" href="/account">
        TÀI KHOẢN
      </Link>
      <PreferencesPanel />
    </main>
  );
}
