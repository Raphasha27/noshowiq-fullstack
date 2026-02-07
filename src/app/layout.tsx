import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthBridge AI - Rural Healthcare Resource Allocation",
  description: "AI-powered platform for optimizing healthcare resources in rural South African clinics. Predicts patient volume, manages medicine stock, and allocates staff efficiently.",
  keywords: ["healthcare", "AI", "South Africa", "rural clinics", "resource allocation", "medicine management", "patient volume prediction"],
  authors: [{ name: "Raphasha27" }],
  openGraph: {
    title: "HealthBridge AI - Rural Healthcare Resource Allocation",
    description: "AI-powered platform for South African rural healthcare",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
