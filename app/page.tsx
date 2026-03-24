"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function HomePage() {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem('mabataki_streak') || '{"count":0,"last":""}');
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.last === today) setStreak(data.count);
    else if (data.last === yesterday) {
      const updated = { count: data.count + 1, last: today };
      localStorage.setItem('mabataki_streak', JSON.stringify(updated));
      setStreak(updated.count);
    } else {
      const updated = { count: 1, last: today };
      localStorage.setItem('mabataki_streak', JSON.stringify(updated));
      setStreak(1);
    }
  }, []);
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #050510, #0a0a2e, #050510)" }}>
      <div className="text-center mb-8 p-6 rounded-3xl"
        style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "24px" }}>
        <img src="/images/eye_open.png" alt="まばたき禁止" className="w-28 h-28 mx-auto mb-4" style={{ filter: "drop-shadow(0 0 24px rgba(99,102,241,0.8))" }} />
        <h1 className="text-4xl font-black mb-2" style={{ color: "#818cf8", textShadow: "0 0 20px rgba(129,140,248,0.5)" }}>
          まばたき禁止
        </h1>
        <p className="text-lg text-indigo-300 font-bold mb-1">まばたきしたら終わり！</p>
        <p className="text-sm text-indigo-500">AIがあなたの目を監視。一瞬でもまばたきすればゲームオーバー。</p>
      </div>
      {streak > 1 && (
        <div className="text-center text-sm text-orange-400 mb-4 px-4 py-2 rounded-full"
          style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          {streak}日連続プレイ中!
        </div>
      )}
      <Link href="/game"
        className="inline-block px-14 py-4 rounded-2xl text-xl font-black mb-10 transition-all active:scale-95 min-h-[44px]"
        aria-label="まばたき禁止ゲームを開始する"
        style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)", boxShadow: "0 0 30px rgba(99,102,241,0.5)", color: "#fff" }}>
        スタート
      </Link>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("まばたき禁止に挑戦！AIがリアルタイムで目を監視。何秒耐えられる？ #まばたき禁止 #カジュアルゲーム https://mabataki-kinshi.vercel.app")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm mb-8 min-h-[44px] transition-all hover:opacity-80"
        style={{ background: "rgba(0,0,0,0.7)", color: "#fff", border: "1px solid rgba(99,102,241,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        aria-label="まばたき禁止をXでシェアする"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        Xでシェアする
      </a>
      <div className="w-full max-w-sm space-y-3">
        {[
          { num: "1", title: "カメラを許可する", desc: "AIがリアルタイムで目の動きを分析" },
          { num: "2", title: "目を開き続ける", desc: "まばたきしないで！タイマーが刻んでいく" },
          { num: "3", title: "まばたき = ゲームオーバー", desc: "一瞬でも目を閉じたら即終了" },
          { num: "4", title: "記録を更新しよう", desc: "30秒？1分？どこまで耐えられるか挑戦！" },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-center p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(99,102,241,0.22)", borderRadius: "12px" }}>
            <span className="text-xl font-black text-indigo-400 w-8 text-center">{item.num}</span>
            <div>
              <div className="font-bold text-indigo-200 text-sm">{item.title}</div>
              <div className="text-xs text-indigo-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-10 text-center text-xs text-indigo-900 pb-6 w-full max-w-sm px-4 py-4 rounded-2xl"
        style={{ background: "rgba(99,102,241,0.05)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
        <p>© 2026 ポッコリラボ</p>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:text-indigo-700" aria-label="Xでお問い合わせ（@levona_design）">お問い合わせ: X @levona_design</a>
        </p>
        <p className="mt-2 space-x-3">
          <a href="/privacy" className="underline hover:text-indigo-700" aria-label="プライバシーポリシーを見る">プライバシーポリシー</a>
          <span>|</span>
          <a href="/legal" className="underline hover:text-indigo-700" aria-label="特定商取引法に基づく表記を見る">特商法表記</a>
        </p>
      </footer>
    </div>
  );
}
