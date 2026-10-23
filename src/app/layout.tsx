import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Space",
  description: "Không gian riêng của hai người.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
