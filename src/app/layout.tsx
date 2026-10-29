import type { Metadata } from "next";
import PreferenceRuntime from "./preference-runtime";
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
      <body>
        <PreferenceRuntime>{children}</PreferenceRuntime>
      </body>
    </html>
  );
}
