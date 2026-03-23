import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #050510, #0a0a2e, #050510)" }}>
      <div className="text-center mb-8">
        <img src="/images/eye_open.png" alt="まばたき禁止" className="w-28 h-28 mx-auto mb-4" style={{ filter: "drop-shadow(0 0 24px rgba(99,102,241,0.8))" }} />
        <h1 className="text-4xl font-black mb-2" style={{ color: "#818cf8", textShadow: "0 0 20px rgba(129,140,248,0.5)" }}>
          まばたき禁止
        </h1>
        <p className="text-lg text-indigo-300 font-bold mb-1">まばたきしたら終わり！</p>
        <p className="text-sm text-indigo-500">AIがあなたの目を監視。一瞬でもまばたきすればゲームオーバー。</p>
      </div>
      <Link href="/game"
        className="inline-block px-14 py-4 rounded-2xl text-xl font-black mb-10 transition-all active:scale-95 min-h-[44px]"
        aria-label="まばたき禁止ゲームを開始する"
        style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)", boxShadow: "0 0 30px rgba(99,102,241,0.5)", color: "#fff" }}>
        スタート 👁️
      </Link>
      <div className="w-full max-w-sm space-y-3">
        {[
          { icon: "📷", title: "カメラを許可する", desc: "AIがリアルタイムで目の動きを分析" },
          { icon: "👁️", title: "目を開き続ける", desc: "まばたきしないで！タイマーが刻んでいく" },
          { icon: "😳", title: "まばたき = ゲームオーバー", desc: "一瞬でも目を閉じたら即終了" },
          { icon: "🏆", title: "記録を更新しよう", desc: "30秒？1分？どこまで耐えられるか挑戦！" },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-center p-3 rounded-xl"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="font-bold text-indigo-200 text-sm">{item.title}</div>
              <div className="text-xs text-indigo-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-10 text-center text-xs text-indigo-900 pb-6">
        <p>© 2026 ポッコリラボ</p>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:text-indigo-700" aria-label="Xでお問い合わせ（@levona_design）">お問い合わせ: X @levona_design</a>
        </p>
      </footer>
    </div>
  );
}
