import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #050510, #0a0a2e, #050510)" }}>
      <div className="text-center mb-8">
        <div className="text-8xl mb-4" style={{ filter: "drop-shadow(0 0 24px rgba(99,102,241,0.8))" }}>👁️</div>
        <h1 className="text-4xl font-black mb-2" style={{ color: "#818cf8", textShadow: "0 0 20px rgba(129,140,248,0.5)" }}>
          Blink Saver
        </h1>
        <p className="text-lg text-indigo-300 font-bold mb-1">Don&apos;t you dare blink!</p>
        <p className="text-sm text-indigo-500">AI watches your eyes. One blink = game over.</p>
      </div>
      <Link href="/game"
        className="inline-block px-14 py-4 rounded-2xl text-xl font-black mb-10 transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)", boxShadow: "0 0 30px rgba(99,102,241,0.5)", color: "#fff" }}>
        Stare Contest 👁️
      </Link>
      <div className="w-full max-w-sm space-y-3">
        {[
          { icon: "📷", title: "Allow camera", desc: "AI watches your eyes in real-time" },
          { icon: "👁️", title: "Keep eyes open", desc: "Don't blink — the timer is counting!" },
          { icon: "😳", title: "Blink = Game Over", desc: "One blink ends the run immediately" },
          { icon: "🏆", title: "Beat your record", desc: "Can you last 30 seconds? 1 minute?" },
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
    </div>
  );
}
