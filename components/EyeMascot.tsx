"use client";
import React from "react";

export type EyePose = "idle" | "alert" | "blink" | "dead";

interface Props {
  pose: EyePose;
  size?: number;
}

export default function EyeMascot({ pose, size = 96 }: Props) {
  const isIdle  = pose === "idle";
  const isAlert = pose === "alert";
  const isBlink = pose === "blink";
  const isDead  = pose === "dead";

  // アイリス・瞳の縦スケール（まばたきで縮む）
  const lidScale = isBlink ? 0.05 : isAlert ? 1.15 : isDead ? 0.5 : 0.9;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: isDead
          ? "drop-shadow(0 0 8px rgba(239,68,68,0.7))"
          : isAlert
          ? "drop-shadow(0 0 16px rgba(6,182,212,0.9))"
          : "drop-shadow(0 0 10px rgba(14,165,233,0.6))",
        animation: isIdle ? "eyeIdleSway 3s ease-in-out infinite" : undefined,
      }}
      aria-label={`みるみ - ${pose}`}
      role="img"
    >
      <style>{`
        @keyframes eyeIdleSway {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-4px) rotate(2deg); }
        }
        @keyframes eyeAlertPulse {
          0%, 100% { filter: drop-shadow(0 0 16px rgba(6,182,212,0.9)); }
          50%       { filter: drop-shadow(0 0 28px rgba(6,182,212,1.0)); }
        }
      `}</style>

      {/* 外側グロー */}
      <ellipse cx="50" cy="50" rx="42" ry="42" fill="rgba(14,165,233,0.08)" />

      {/* 眼球（白目） */}
      <ellipse cx="50" cy="52" rx="36" ry="32" fill="#e2e8f0" />

      {/* 虹彩 */}
      <ellipse
        cx="50"
        cy="52"
        rx="20"
        ry={isDead ? 10 : 20 * lidScale}
        fill="#0ea5e9"
        style={{ transition: "all 0.1s" }}
      />

      {/* 瞳孔 */}
      {!isDead && (
        <ellipse
          cx={isAlert ? 52 : 50}
          cy="52"
          rx="9"
          ry={9 * lidScale}
          fill="#0c1445"
          style={{ transition: "all 0.1s" }}
        />
      )}

      {/* 死亡時: X目 */}
      {isDead && (
        <>
          <line x1="38" y1="44" x2="52" y2="60" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="52" y1="44" x2="38" y2="60" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="58" y1="44" x2="72" y2="60" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="72" y1="44" x2="58" y2="60" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </>
      )}

      {/* アラート時: 瞳ハイライト */}
      {isAlert && (
        <ellipse cx="57" cy="45" rx="4" ry="4" fill="rgba(255,255,255,0.7)" />
      )}

      {/* 通常ハイライト */}
      {!isDead && !isAlert && (
        <ellipse cx="57" cy="46" rx="3" ry="3" fill="rgba(255,255,255,0.5)" />
      )}

      {/* まつ毛（上） */}
      <path d="M14 30 Q20 14 35 20" stroke="#1e3a8a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M28 18 Q36 6  50 14" stroke="#1e3a8a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M50 14 Q64 6  72 18" stroke="#1e3a8a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M65 20 Q80 14 86 30" stroke="#1e3a8a" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* まぶた（まばたき時は閉じる） */}
      {isBlink && (
        <ellipse cx="50" cy="52" rx="36" ry="5" fill="#1e3a8a" opacity="0.95" />
      )}

      {/* 眼球の輪郭 */}
      <ellipse cx="50" cy="52" rx="36" ry="32" stroke="#1e3a8a" strokeWidth="2.5" fill="none" />

      {/* アラート時: 緊張オーラ */}
      {isAlert && (
        <>
          <path d="M10 50 L5 44 L12 47 Z" fill="#6ee7b7" opacity="0.7" />
          <path d="M90 50 L95 44 L88 47 Z" fill="#6ee7b7" opacity="0.7" />
          <path d="M50 14 L44 8 L51 12 Z" fill="#6ee7b7" opacity="0.7" />
        </>
      )}
    </svg>
  );
}
