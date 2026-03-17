import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "👁️ まばたき禁止 | まばたきしたら終わり！",
  description: "何秒まばたきせずに耐えられる？AIがあなたの目をリアルタイム監視。一瞬でもまばたきしたらゲームオーバー！",
  openGraph: {
    title: "👁️ まばたき禁止",
    description: "AIがあなたの目を監視。まばたきしたら即ゲームオーバー！何秒耐えられる？",
    type: "website",
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ja"><body>{children}</body></html>;
}
