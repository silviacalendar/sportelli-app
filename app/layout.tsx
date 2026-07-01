import AuthGuard from './components/AuthGuard';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agenda Sportello Digitale",
  description: "Agenda Sportello Digitale",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html
  lang="it"
  translate="no"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased notranslate`}
>
<body
  translate="no"
  className="min-h-full flex flex-col notranslate"
>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
