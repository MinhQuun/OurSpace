import Link from "next/link";
import PermissionPanel from "../permission-panel";
export default async function PermissionPage({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  return (
    <main className="account-page">
      <Link href="/account">Tài khoản</Link>
      <PermissionPanel resourceId={resourceId} />
    </main>
  );
}
