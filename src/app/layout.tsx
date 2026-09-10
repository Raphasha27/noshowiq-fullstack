import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoShowIQ - Healthcare No-Show Prediction",
  description: "AI-powered platform for predicting patient no-shows in healthcare facilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}