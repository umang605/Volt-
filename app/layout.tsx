import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOLT — Recruitment Intelligence Platform",
  description: "The next-generation recruitment intelligence platform. Replacing every outdated ATS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
