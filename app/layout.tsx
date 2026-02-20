import type { Metadata, Viewport } from "next";
import "./globals.css";

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
        <div style={{ maxWidth: 448, margin: '0 auto', minHeight: '100vh', position: 'relative', background: '#F7F9FB' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
