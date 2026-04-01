import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import OrbBackground from "@/components/OrbBackground";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

const SITE_URL = "https://mabataki-kinshi.vercel.app";
const TITLE = "まばたき禁止 | まばたきしたら終わり！集中力ゲーム";
const DESC = "何秒まばたきせずに耐えられる？AIがあなたの目をリアルタイム監視。一瞬でもまばたきしたらゲームオーバー！集中力・忍耐力を鍛えるカジュアルゲーム。無料・登録不要。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["まばたき禁止", "集中力ゲーム", "反射神経", "カメラゲーム", "ブラウザゲーム", "無料ゲーム", "AIゲーム", "目 ゲーム", "まばたき 耐久"],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    url: SITE_URL,
    siteName: "まばたき禁止",
    locale: "ja_JP",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "まばたき禁止" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og.png`],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0a0f2e" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoGame",
      "name": "まばたき禁止",
      "description": DESC,
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web",
      "url": SITE_URL,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "genre": "Concentration Game",
      "publisher": { "@type": "Organization", "name": "ポッコリラボ" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "まばたき禁止はどうやって遊ぶの？",
          "acceptedAnswer": { "@type": "Answer", "text": "スタートボタンを押すとカメラが起動し、AIがあなたの目を監視します。まばたきを検出した瞬間にゲームオーバー。何秒耐えられるかを競います。スマホ・PCどちらでも無料で遊べます。" }
        },
        {
          "@type": "Question",
          "name": "カメラの使用は安全ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。カメラ映像はすべてブラウザ内のみで処理されます。サーバーへのアップロードや保存は一切行いません。顔認識はface-api.jsを使用し、完全にローカルで動作します。" }
        },
        {
          "@type": "Question",
          "name": "スコアはシェアできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。ゲームオーバー後にシェアボタンが表示されます。スコアカード画像とともにXでシェアできます。友達と記録を競いましょう。" }
        },
        {
          "@type": "Question",
          "name": "世界記録・ランキングはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "デイリーランキングを実装予定です。現在は自分のハイスコアがローカルに保存されます。毎回プレイするたびに自己ベスト更新を目指してください。" }
        },
        {
          "@type": "Question",
          "name": "目が乾燥しても大丈夫ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "ゲーム中は目が乾燥しやすくなります。長時間プレイは避け、適度に休憩を取ってください。目の健康のために1回のプレイは短時間にすることをおすすめします。" }
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} text-slate-100 antialiased`}>
        <OrbBackground />
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
