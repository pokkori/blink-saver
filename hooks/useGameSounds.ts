import { useRef, useCallback } from "react";

export function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback((freq: number, type: OscillatorType, dur: number, vol = 0.3, delay = 0) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch { /* silent fail */ }
  }, [getCtx]);

  // 計測開始「ピッ」
  const playStart = useCallback(() => {
    tone(880, "triangle", 0.1, 0.35);
  }, [tone]);

  // 目が閉じそう警告（断続的アラーム）
  const playWarning = useCallback(() => {
    tone(660, "square", 0.06, 0.25);
    tone(440, "square", 0.06, 0.2, 0.1);
  }, [tone]);

  // まばたきした！ゲームオーバー「ブーッ」
  const playBlink = useCallback(() => {
    tone(200, "sawtooth", 0.15, 0.5);
    tone(150, "sawtooth", 0.25, 0.4, 0.1);
    tone(100, "sine", 0.3, 0.3, 0.2);
  }, [tone]);

  // 新記録「チャーン」
  const playNewRecord = useCallback(() => {
    const seq = [784, 988, 1175, 1568];
    seq.forEach((f, i) => tone(f, "triangle", 0.25, 0.4, i * 0.1));
  }, [tone]);

  return { playStart, playWarning, playBlink, playNewRecord };
}
