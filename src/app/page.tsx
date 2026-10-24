import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <p className="eyebrow">OUR SPACE</p>
      <h1>
        Một nơi dành cho
        <br />
        hai chúng mình.
      </h1>
      <p className="intro">
        Những kỷ niệm nhỏ, những dự định lớn — cùng nhau gìn giữ.
      </p>
      <aside role="status">
        <h2>Không gian đang được chuẩn bị</h2>
        <p>Bản thử nghiệm đã có đăng ký và đăng nhập. Các tính năng không gian chung đang được hoàn thiện.</p>
        <Link href="/account">Đăng nhập hoặc tạo tài khoản</Link>
      </aside>
    </main>
  );
}
