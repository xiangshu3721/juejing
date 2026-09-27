import type { Metadata } from "next";
import { assetUrl } from "@/lib/urls";
import "./globals.css";

export const metadata: Metadata = {
  title: "觉镜 JueLens",
  description: "AI 个案复盘与专业成长助手。看见来访者，也看见自己。",
  icons: {
    icon: [
      { url: assetUrl("/favicon.ico"), sizes: "32x32" },
      { url: assetUrl("/icon.svg"), type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

