import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Music Gallery — Discover & Explore",
  description: "Curated sonic experiences. Discover music, explore artists, and dive into albums.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-light">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
