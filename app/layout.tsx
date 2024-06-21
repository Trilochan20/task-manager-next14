import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import "atropos/css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Task manger",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={kanit.className}>{children}</body>
    </html>
  );
}
