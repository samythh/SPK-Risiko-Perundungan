// File: frontend/src/app/layout.tsx
// Deskripsi: Layout utama yang sekarang bersih dari logika MUI dan murni sebagai Server Component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Mengimpor pembungkus yang baru saja kita buat
import ThemeRegistry from "@/components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

// Karena ini Server Component, kita diizinkan menggunakan fungsi metadata untuk SEO web
export const metadata: Metadata = {
  title: "SPK Risiko Perundungan",
  description: "Aplikasi Sistem Pendukung Keputusan menggunakan metode AHP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Kita bungkus seluruh aplikasi dengan komponen Client kita */}
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}