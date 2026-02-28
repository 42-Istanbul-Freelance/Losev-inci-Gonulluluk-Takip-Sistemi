import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LÖSEV İnci Gönüllülük Takip Sistemi",
  description:
    "LÖSEV İnci öğrencilerinin sosyal sorumluluk çalışmalarını kayıt altına alan, doğrulayan ve raporlayan takip sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
