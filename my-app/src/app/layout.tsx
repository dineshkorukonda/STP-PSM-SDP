import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartPass",
  description: "One smart pass for all transport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
