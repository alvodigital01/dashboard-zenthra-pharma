import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { APP_NAME } from "@/lib/constants";
import rochaLogo from "@/logorochacustombancos.jpeg";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Dashboard comercial da Rocha Custom Bancos para vendas de bancos e espumas.",
  icons: {
    icon: rochaLogo.src,
    shortcut: rochaLogo.src,
    apple: rochaLogo.src
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={sans.variable}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
