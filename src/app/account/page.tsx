import AccountForm from './account-form';
import Link from 'next/link';

export default function AccountPage() {
  return <main className="account-page">
    <Link className="eyebrow" href="/">OUR SPACE</Link>
    <AccountForm />
  </main>;
}
