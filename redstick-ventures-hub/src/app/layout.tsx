import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redstick Ventures - AI-Powered Venture Capital",
  description: "Early-stage venture capital firm investing at the intersection of food systems, agriculture, and AI.",
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
