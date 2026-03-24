import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "️ まばたき禁止 | まばたきしたら終わり！";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #050510, #0a0a2e, #050510)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20, filter: "drop-shadow(0 0 40px rgba(99,102,241,0.8))" }}>️</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#818cf8", marginBottom: 12, textShadow: "0 0 40px rgba(129,140,248,0.5)" }}>
          まばたき禁止
        </div>
        <div style={{ fontSize: 32, color: "#a5b4fc", fontWeight: 700, marginBottom: 8 }}>
          まばたきしたら終わり！
        </div>
        <div style={{ fontSize: 24, color: "#6366f1" }}>
          AIがあなたの目をリアルタイム監視 — 何秒耐えられる？
        </div>
      </div>
    ),
    { ...size }
  );
}
