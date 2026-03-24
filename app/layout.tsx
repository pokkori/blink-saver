import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
