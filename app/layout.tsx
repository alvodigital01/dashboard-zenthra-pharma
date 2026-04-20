import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { APP_NAME } from "@/lib/constants";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Dashboard comercial com controle de vendas, faturamento e relatorios.",
  icons: {
    icon: "/brand-logo.png",
    shortcut: "/brand-logo.png",
    apple: "/brand-logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${display.variable}`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
