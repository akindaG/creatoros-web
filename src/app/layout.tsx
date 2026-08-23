import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CreatorOS AI", template: "%s | CreatorOS AI" },
  description: "AI-powered social growth intelligence for creators and modern brands.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
