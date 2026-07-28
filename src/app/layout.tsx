import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteSettingsShell } from "@/components/site/SiteSettingsShell";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eco Fashion | Men's Fashion",
    template: "%s | Eco Fashion",
  },
  description: "Men's fashion ecommerce — thoughtful pieces for everyday style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <SiteSettingsShell>{children}</SiteSettingsShell>
        </AppProviders>
      </body>
    </html>
  );
}
