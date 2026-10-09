import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TBLS Control Center",
  description: "IoT device controls and real-time command activity",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
