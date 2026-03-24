import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://mabataki-kinshi.vercel.app";

export const metadata: Metadata = {
  title: "️ まばたき禁止 | まばたきしたら終わり！",
  description: "何秒まばたきせずに耐えられる？AIがあなたの目をリアルタイム監視。一瞬でもまばたきしたらゲームオーバー！",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "️ まばたき禁止",
    description: "AIがあなたの目を監視。まばたきしたら即ゲームオーバー！何秒耐えられる？",
    type: "website",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og.svg`, width: 1200, height: 630, alt: "まばたき禁止" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "️ まばたき禁止",
    description: "AIがあなたの目を監視。まばたきしたら即ゲームオーバー！何秒耐えられる？",
    images: [`${SITE_URL}/og.svg`],
  },
};
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "まばたき禁止",
  "description": "カメラでまばたきを検出する集中力ゲーム",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Web",
  "url": "https://mabataki-kinshi.vercel.app",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
  "genre": "Concentration Game"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
