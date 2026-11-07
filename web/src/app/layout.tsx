import type { Metadata, Viewport } from "next";
import { Inter, Lexend } from "next/font/google";
import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/lib/session";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: "Dawr", template: "%s · Dawr" },
  description: "A calm daily tracker for hifz revision.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The theme cookie is read on the server so the first paint is already right (no flash).
  const theme = (await cookies()).get(THEME_COOKIE)?.value;
  return (
    <html lang="en" data-theme={theme === "light" || theme === "dark" ? theme : undefined} suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} min-h-dvh antialiased`}>{children}</body>
    </html>
  );
}
