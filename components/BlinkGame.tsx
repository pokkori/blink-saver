"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameSounds } from "@/hooks/useGameSounds";
import { useBlinkBGM } from "@/hooks/useBlinkBGM";
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";
import OrbBackground from "@/components/OrbBackground";
import EyeMascot, { type EyePose } from "@/components/EyeMascot";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const BLINK_THRESHOLD = 0.4;

export default function BlinkGame() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<unknown>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const searchParams = useSearchParams();
  const challengeTime = searchParams.get("challenge")
    ? parseFloat(searchParams.get("challenge")!)
    : null;

  const [phase, setPhase] = useState<"idle" | "loading" | "playing" | "result">("idle");
  const { playStart, playWarning, playBlink, playNewRecord } = useGameSounds();
  const { startBGM, stopBGM } = useBlinkBGM();
  const warnCooldownRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [leftBlink, setLeftBlink] = useState(0);
  const [rightBlink, setRightBlink] = useState(0);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [mascotPose, setMascotPose] = useState<EyePose>("idle");

  useEffect(() => {
    const bt = localStorage.getItem("blink_saver_best");
    if (bt) setBestTime(parseFloat(bt));
    setStreakData(loadStreak("mabataki"));
  }, []);

  const stopStream = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const endGame = useCallback((finalTime: number) => {
    isRunningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    stopBGM();
    setMascotPose("dead");
    const prevBest = parseFloat(localStorage.getItem("blink_saver_best") ?? "0");
    if (finalTime > prevBest) {
      localStorage.setItem("blink_saver_best", String(finalTime));
      setBestTime(finalTime);
      playNewRecord();
    } else {
      playBlink();
    }
    const updated = updateStreak("mabataki");
    setStreakData(updated);
    setElapsed(finalTime);
    setPhase("result");
  }, [playBlink, playNewRecord, stopBGM]);

  const loadAndStart = useCallback(async () => {
    isRunningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    stopStream();
    stopBGM();

    setPhase("loading");
    setMascotPose("idle");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (!landmarkerRef.current) {
        const vision = await import("@mediapipe/tasks-vision");
        const { FaceLandmarker, FilesetResolver } = vision;
        const fs = await FilesetResolver.forVisionTasks(WASM_URL);
        const fl = await FaceLandmarker.createFromOptions(fs, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
        });
        landmarkerRef.current = fl;
      }
      startTimeRef.current = performance.now();
      isRunningRef.current = true;
      setElapsed(0);
      setMascotPose("alert");
      setPhase("playing");
      playStart();
      startBGM();
    } catch (e) {
      console.error(e);
      setError("カメラへのアクセスを許可してください");
      setPhase("idle");
      setMascotPose("idle");
    }
  }, [playStart, stopStream, stopBGM, startBGM]);

  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function loop(now: number) {
      if (!isRunningRef.current) return;
      const currentElapsed = (now - startTimeRef.current) / 1000;
      setElapsed(currentElapsed);
      const lm = landmarkerRef.current as {
        detectForVideo: (
          v: HTMLVideoElement,
          t: number
        ) => {
          faceBlendshapes?: Array<{
            categories: Array<{ categoryName: string; score: number }>;
          }>;
        };
      } | null;
      if (lm && video!.readyState >= 2) {
        try {
          const result = lm.detectForVideo(video!, now);
          if (result.faceBlendshapes?.[0]) {
            const bs: Record<string, number> = {};
            result.faceBlendshapes[0].categories.forEach((c) => {
              bs[c.categoryName] = c.score;
            });
            const lb = bs.eyeBlinkLeft ?? 0;
            const rb = bs.eyeBlinkRight ?? 0;
            setLeftBlink(lb);
            setRightBlink(rb);
            if (lb > BLINK_THRESHOLD && rb > BLINK_THRESHOLD) {
              ctx!.fillStyle = "rgba(255,255,255,0.9)";
              ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
              endGame(currentElapsed);
              return;
            }
            ctx!.save();
            ctx!.scale(-1, 1);
            ctx!.drawImage(video!, -canvas!.width, 0, canvas!.width, canvas!.height);
            ctx!.restore();
            const eyeOpen = 1 - Math.max(lb, rb);
            const eyeColor =
              eyeOpen > 0.7 ? "#22c55e" : eyeOpen > 0.4 ? "#f59e0b" : "#ef4444";
            ctx!.fillStyle = "rgba(0,0,0,0.5)";
            ctx!.fillRect(0, 0, canvas!.width, 50);
            ctx!.fillStyle = eyeColor;
            ctx!.font = "bold 20px system-ui";
            ctx!.textAlign = "center";
            ctx!.textBaseline = "middle";
            ctx!.fillText(currentElapsed.toFixed(2) + "秒", canvas!.width / 2, 25);
            if (eyeOpen < 0.5) {
              setMascotPose("blink");
              ctx!.fillStyle = "rgba(239,68,68,0.3)";
              ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
              ctx!.fillStyle = "#ef4444";
              ctx!.font = "bold 28px system-ui";
              ctx!.fillText("目を開けて！", canvas!.width / 2, canvas!.height / 2);
              if (now - warnCooldownRef.current > 800) {
                playWarning();
                warnCooldownRef.current = now;
              }
            } else {
              setMascotPose("alert");
            }
          } else {
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
            ctx!.fillStyle = "#050510";
            ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
            ctx!.fillStyle = "#6366f1";
            ctx!.font = "18px system-ui";
            ctx!.textAlign = "center";
            ctx!.textBaseline = "middle";
            ctx!.fillText("顔を検出中... 近づいてください", canvas!.width / 2, canvas!.height / 2);
          }
        } catch {
          /* non-fatal */
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    isRunningRef.current = true;
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase, endGame]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      isRunningRef.current = false;
      stopStream();
      stopBGM();
    },
    [stopStream, stopBGM]
  );

  const formatTime = (s: number) => s.toFixed(2) + "秒";
  const getRank = (s: number) =>
    s >= 60 ? "伝説の瞳" :
    s >= 30 ? "鉄の瞳" :
    s >= 15 ? "集中型" :
    s >= 5  ? "初心者" :
              "練習が必要";

  const challengeUrl = "https://mabataki-kinshi.vercel.app/game?challenge=" + elapsed.toFixed(2);
  const challengeResult = challengeTime !== null
    ? (elapsed >= challengeTime ? "勝ち！" : "負け...")
    : null;
  const challengeDiff = challengeTime !== null
    ? elapsed - challengeTime
    : null;

  const shareText =
    "【まばたき禁止】" + elapsed.toFixed(2) + "秒耐えた！あなたは何秒耐えられる？ → https://mabataki-kinshi.vercel.app #まばたき禁止 #反射神経 #AIカメラゲーム";
  const shareUrl =
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText);

  if (phase === "result") {
    return (
      <div
        className="min-h-dvh flex items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #0a0f1e, #050510, #0a0a2e)" }}
      >
        <OrbBackground />
        <div
          className="w-full max-w-sm rounded-2xl p-6 text-center relative z-10"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 30px rgba(14,165,233,0.15)",
          }}
        >
          <div className="flex justify-center mb-3">
            <EyeMascot pose="dead" size={72} />
          </div>
          <h2 className="text-xl font-black mb-1 text-indigo-300">まばたきした！</h2>
          <div
            className="text-5xl font-black mb-1"
            style={{ color: "#818cf8", textShadow: "0 0 20px rgba(129,140,248,0.7)" }}
          >
            {formatTime(elapsed)}
          </div>
          <div className="text-lg font-bold mb-4 text-indigo-300">{getRank(elapsed)}</div>
          {challengeTime !== null && challengeDiff !== null && (
            <div className={`text-lg font-black mb-3 ${challengeDiff >= 0 ? "text-green-400" : "text-red-400"}`}>
              {challengeResult}
              <span className="block text-sm font-bold mt-1">
                友達より{Math.abs(challengeDiff).toFixed(2)}秒{challengeDiff >= 0 ? "長い" : "短い"}
              </span>
            </div>
          )}
          {bestTime !== null && elapsed >= bestTime && (
            <div
              className="text-yellow-400 font-bold mb-3"
              style={{ textShadow: "0 0 12px rgba(234,179,8,0.8)" }}
            >
              新記録！
            </div>
          )}
          {bestTime !== null && elapsed < bestTime && (
            <div className="text-indigo-400 text-sm mb-3">
              ベスト: {formatTime(bestTime)}
              <span className="block text-xs mt-0.5 text-indigo-500">
                あと{(bestTime - elapsed).toFixed(2)}秒で自己ベスト更新！
              </span>
            </div>
          )}
          <div className="space-y-2">
            <button
              onClick={loadAndStart}
              className="w-full py-3 rounded-xl font-black text-white min-h-[44px]"
              aria-label="もう一度まばたき禁止に挑戦する"
              style={{
                background: "linear-gradient(135deg, #6366f1, #4338ca)",
                boxShadow: "0 0 20px rgba(99,102,241,0.5)",
              }}
            >
              もう一度挑戦
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(challengeUrl).catch(() => {});
              }}
              className="w-full py-2 rounded-xl font-bold text-indigo-300 min-h-[44px]"
              aria-label="挑戦URLをコピーして友達に送る"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
            >
              友達に挑戦状を送る
            </button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Xで記録をシェアして自慢する"
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3 rounded-2xl text-lg flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xでシェアして自慢する
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center"
      style={{ background: "linear-gradient(160deg, #0a0f1e, #050510, #0a0a2e)" }}
    >
      <OrbBackground />
      <div className="w-full max-w-lg px-3 py-2 flex items-center justify-between relative z-10">
        <a href="/" className="text-indigo-400 text-sm min-h-[44px] inline-flex items-center" aria-label="トップページに戻る">
          ← 戻る
        </a>
        <span className="font-black text-base flex items-center gap-2" style={{ color: "#818cf8" }}>
          <EyeMascot pose={mascotPose} size={24} />
          まばたき禁止
        </span>
        <div />
      </div>
      <div className="relative w-full max-w-lg z-10" style={{ aspectRatio: "4/3" }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: phase === "playing" ? "block" : "none" }}
        />
        {phase !== "playing" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(4px)",
            }}
          >
            {phase === "loading" && (
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <EyeMascot pose="idle" size={64} />
                </div>
                <p className="text-indigo-300 animate-pulse font-bold">カメラ起動中...</p>
              </div>
            )}
            {phase === "idle" && (
              <div className="text-center px-4">
                <div className="flex justify-center mb-3">
                  <EyeMascot pose={mascotPose} size={80} />
                </div>
                <h1 className="text-2xl font-black mb-1" style={{ color: "#818cf8", textShadow: "0 0 16px rgba(129,140,248,0.7)" }}>
                  まばたき禁止
                </h1>
                <p className="text-indigo-400 text-sm mb-4">何秒耐えられる？</p>
                {challengeTime !== null && (
                  <div
                    className="mb-4 px-4 py-2 rounded-xl animate-pulse"
                    style={{
                      background: "rgba(234,179,8,0.15)",
                      border: "1px solid rgba(234,179,8,0.4)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <p className="text-yellow-400 font-black text-lg">
                      {challengeTime.toFixed(1)}秒の記録に挑戦！
                    </p>
                    <p className="text-yellow-600 text-xs">友達からの挑戦状</p>
                  </div>
                )}
                {streakData && streakData.count > 0 && (
                  <div
                    className="mb-3 px-4 py-2 rounded-xl"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <p className="text-indigo-300 font-bold text-sm">{streakData.count}日連続プレイ中</p>
                    {getStreakMilestoneMessage(streakData.count) && (
                      <p className="text-yellow-400 text-xs mt-0.5">{getStreakMilestoneMessage(streakData.count)}</p>
                    )}
                  </div>
                )}
                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                {bestTime && (
                  <p className="text-indigo-400 text-sm mb-3">
                    ベスト: {formatTime(bestTime)}
                  </p>
                )}
                <button
                  onClick={loadAndStart}
                  className="px-10 py-3 rounded-2xl font-black text-white text-lg min-h-[44px]"
                  aria-label="カメラを起動してまばたき禁止ゲームを開始する"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #4338ca)",
                    boxShadow: "0 0 24px rgba(99,102,241,0.6)",
                  }}
                >
                  スタート
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {phase === "playing" && (
        <div className="w-full max-w-lg px-4 py-3 flex gap-4 justify-center relative z-10">
          <div className="text-center">
            <div className="text-xs text-indigo-400">左目</div>
            <div className="w-20 h-2 rounded-full overflow-hidden mt-1"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full"
                style={{ width: (1 - leftBlink) * 100 + "%", background: 1 - leftBlink > 0.6 ? "#22c55e" : "#ef4444" }} />
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-4xl font-black"
              style={{ color: "#818cf8", textShadow: "0 0 12px rgba(129,140,248,0.6)" }}
            >
              {elapsed.toFixed(2)}秒
            </div>
            {challengeTime !== null && (
              <div className="text-xs font-bold mt-1"
                style={{ color: elapsed >= challengeTime ? "#22c55e" : "#f59e0b" }}>
                目標: {challengeTime.toFixed(1)}秒
                {elapsed >= challengeTime && " 突破！"}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-xs text-indigo-400">右目</div>
            <div className="w-20 h-2 rounded-full overflow-hidden mt-1"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full"
                style={{ width: (1 - rightBlink) * 100 + "%", background: 1 - rightBlink > 0.6 ? "#22c55e" : "#ef4444" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
