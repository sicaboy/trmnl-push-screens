import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Ink Display Generator",
  description: "Generate 800x480 grayscale content for e-ink displays",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
