"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {[
        { size: 4, x: 15, y: 20, dur: 8, delay: 0, color: "rgba(99,102,241,0.35)" },
        { size: 6, x: 75, y: 15, dur: 12, delay: 1, color: "rgba(129,140,248,0.25)" },
        { size: 3, x: 45, y: 70, dur: 10, delay: 2, color: "rgba(165,180,252,0.30)" },
        { size: 5, x: 85, y: 55, dur: 9, delay: 3, color: "rgba(99,102,241,0.20)" },
        { size: 4, x: 25, y: 85, dur: 11, delay: 4, color: "rgba(129,140,248,0.28)" },
        { size: 7, x: 60, y: 35, dur: 14, delay: 5, color: "rgba(165,180,252,0.18)" },
        { size: 3, x: 10, y: 50, dur: 9, delay: 6, color: "rgba(99,102,241,0.22)" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animation: `floatParticle ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            filter: "blur(1px)",
          }}
        />
      ))}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50% { opacity: 1; }
          100% { transform: translateY(-30px) translateX(15px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/* SVG Eye Icon */
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="eyeGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <filter id="eyeGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="60" cy="60" rx="50" ry="32" stroke="url(#eyeGrad)" strokeWidth="4" fill="rgba(99,102,241,0.1)" filter="url(#eyeGlow)" />
      <circle cx="60" cy="60" r="18" fill="url(#eyeGrad)" />
      <circle cx="60" cy="60" r="8" fill="#0F0F1A" />
      <circle cx="54" cy="54" r="4" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="60" cy="60" rx="50" ry="32" stroke="rgba(129,140,248,0.3)" strokeWidth="1" />
    </svg>
  );
}

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
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-12 relative"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(129,140,248,0.10) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(79,70,229,0.10) 0%, transparent 50%), #0F0F1A",
      }}
    >
      <FloatingParticles />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        {/* Hero card */}
        <div
          className="text-center mb-8 p-8 w-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(99,102,241,0.1)",
          }}
        >
          <EyeIcon className="w-28 h-28 mx-auto mb-4" />
          <h1
            className="text-4xl font-black mb-2"
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(129,140,248,0.4))",
            }}
          >
            まばたき禁止
          </h1>
          <p className="text-lg text-indigo-300 font-bold mb-1">まばたきしたら終わり!</p>
          <p className="text-sm text-indigo-400/70">AIがあなたの目を監視。一瞬でもまばたきすればゲームオーバー。</p>
        </div>

        {streak > 1 && (
          <div
            className="text-center text-sm text-orange-300 mb-4 px-5 py-2 rounded-full font-bold"
            style={{
              background: "rgba(251,146,60,0.1)",
              border: "1px solid rgba(251,146,60,0.25)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 0 20px rgba(251,146,60,0.08)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="inline mr-1 -mt-0.5" aria-hidden="true">
              <path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="#fb923c" />
            </svg>
            {streak}日連続プレイ中!
          </div>
        )}

        {/* CTA Button */}
        <Link
          href="/game"
          className="inline-block px-14 py-4 rounded-2xl text-xl font-black mb-6 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] min-h-[52px]"
          aria-label="まばたき禁止ゲームを開始する"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
            boxShadow: "0 0 30px rgba(99,102,241,0.4), 0 4px 20px rgba(0,0,0,0.3)",
            color: "#fff",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          スタート
        </Link>

        {/* Share button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("まばたき禁止に挑戦！AIがリアルタイムで目を監視。何秒耐えられる？ #まばたき禁止 #カジュアルゲーム https://mabataki-kinshi.vercel.app")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm mb-10 min-h-[44px] transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#c7d2fe",
            border: "1px solid rgba(99,102,241,0.25)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          aria-label="まばたき禁止をXでシェアする"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          Xでシェアする
        </a>

        {/* How to play */}
        <div className="w-full space-y-3">
          {[
            {
              num: "1",
              title: "カメラを許可する",
              desc: "AIがリアルタイムで目の動きを分析",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
            },
            {
              num: "2",
              title: "目を開き続ける",
              desc: "まばたきしないで! タイマーが刻んでいく",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
            },
            {
              num: "3",
              title: "まばたき = ゲームオーバー",
              desc: "一瞬でも目を閉じたら即終了",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>,
            },
            {
              num: "4",
              title: "記録を更新しよう",
              desc: "30秒? 1分? どこまで耐えられるか挑戦!",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-center p-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "16px",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
                {item.icon}
              </div>
              <div>
                <div className="font-bold text-indigo-200 text-sm">{item.title}</div>
                <div className="text-xs text-indigo-400/60">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer
          className="mt-10 text-center text-xs text-indigo-400/50 pb-6 w-full px-4 py-5"
          style={{
            background: "rgba(99,102,241,0.04)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "16px",
            border: "1px solid rgba(99,102,241,0.08)",
          }}
        >
          <p>&copy; 2026 ポッコリラボ</p>
          <p className="mt-1">
            <a href="https://twitter.com/levona_design" className="underline hover:text-indigo-300 transition-colors" aria-label="Xでお問い合わせ（@levona_design）">お問い合わせ: X @levona_design</a>
          </p>
          <p className="mt-2 space-x-3">
            <a href="/privacy" className="underline hover:text-indigo-300 transition-colors" aria-label="プライバシーポリシーを見る">プライバシーポリシー</a>
            <span aria-hidden="true">|</span>
            <a href="/legal" className="underline hover:text-indigo-300 transition-colors" aria-label="特定商取引法に基づく表記を見る">特商法表記</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
