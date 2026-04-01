import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
          "name": "まばたきしてもいいの？",
          "acceptedAnswer": { "@type": "Answer", "text": "ゲーム中はまばたき禁止です。AIカメラがリアルタイムで目の動きを監視しており、まばたきを検出した瞬間にゲームオーバーになります。どれだけ我慢できるかが記録に直結します。" }
        },
        {
          "@type": "Question",
          "name": "スマホで遊べますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、スマホのフロントカメラで遊べます。iOS Safari・Android Chromeどちらにも対応しています。カメラへのアクセス許可を求められたら「許可」を選択してください。" }
        },
        {
          "@type": "Question",
          "name": "スコアはどこで確認できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "ゲームオーバー後に今回の記録と自己ベストが画面に表示されます。ハイスコアはブラウザのローカルストレージに自動保存されるため、次回起動時も確認できます。" }
        },
        {
          "@type": "Question",
          "name": "世界記録はどのくらいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的に人間がまばたきを我慢できる限界は30〜60秒程度とされています。目の乾燥や集中力の限界が記録を左右します。ぜひ自己ベスト更新に挑戦してください。" }
        },
        {
          "@type": "Question",
          "name": "このゲームで集中力は鍛えられますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "まばたきを我慢するには高い集中力と精神力が必要です。継続的に練習することで、注意の持続時間や視覚的集中力の向上が期待できます。スポーツや勉強にも応用できます。" }
        },
        {
          "@type": "Question",
          "name": "子供でも遊べますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、お子様でも安心して遊べます。カメラ映像はブラウザ内のみで処理され、サーバーへの送信は一切ありません。ただし目の健康のため、長時間連続プレイはお控えください。" }
        },
        {
          "@type": "Question",
          "name": "BGMはオフにできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、ゲーム画面上の音量ボタンでBGM・効果音をオフにできます。静かな場所でプレイしたい場合やイヤホンなしの環境でも快適に遊べます。" }
        },
        {
          "@type": "Question",
          "name": "最高記録の保存方法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "ハイスコアはブラウザのローカルストレージに自動保存されます。同じブラウザ・同じ端末であれば次回も記録が残ります。スコアカード画像としてSNSシェアすることで記録を残すこともできます。" }
        },
        {
          "@type": "Question",
          "name": "カメラの使用は安全ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。カメラ映像はすべてブラウザ内のみで処理されます。サーバーへのアップロードや保存は一切行いません。顔認識はface-api.jsを使用し、完全にローカルで動作します。" }
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
        {(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-XXXXXXXX') !== 'ca-pub-XXXXXXXX' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
