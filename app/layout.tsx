import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import LanguageProvider from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "My Quran - Modern Quran App",
  description: "Your digital companion for reading Quran and tracking progress.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My Quran",
  },
};

export const viewport: Viewport = {
  themeColor: "#008D63",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <div style={{ maxWidth: 448, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
