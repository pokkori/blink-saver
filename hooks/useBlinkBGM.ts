import { useRef, useCallback } from "react";

/**
 * まばたき禁止 BGM
 * Web Audio API で生成する緊迫感あるシンセBGM（BPM130）
 * 秒針ビート + 上昇アルペジオ + コード層
 */
export function useBlinkBGM() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  const isPlayingRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // 単音トーン
  const playTone = useCallback(
    (ctx: AudioContext, master: GainNode, freq: number, type: OscillatorType, startTime: number, dur: number, vol: number) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(master);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
        osc.start(startTime);
        osc.stop(startTime + dur + 0.05);
      } catch { /* silent */ }
    },
    []
  );

  // 1ビート分スケジューリング（BPM130 = 0.4615s/beat）
  const scheduleBeat = useCallback(
    (ctx: AudioContext, master: GainNode, beatTime: number, beat: number) => {
      const BPM = 130;
      const beatDur = 60 / BPM;

      // 秒針クリック（全ビート）
      playTone(ctx, master, 2200, "square", beatTime, 0.04, 0.18);

      // バスドラム風（1・3拍目）
      if (beat % 4 === 0 || beat % 4 === 2) {
        playTone(ctx, master, 55,  "sine",     beatTime, 0.18, 0.55);
        playTone(ctx, master, 80,  "sine",     beatTime, 0.12, 0.40);
      }

      // スネア的ホワイトノイズ（2・4拍目）
      if (beat % 4 === 1 || beat % 4 === 3) {
        playTone(ctx, master, 400, "sawtooth", beatTime, 0.08, 0.12);
        playTone(ctx, master, 300, "sawtooth", beatTime, 0.06, 0.10);
      }

      // 上昇アルペジオ（8ビートサイクル）
      const arpNotes = [220, 277, 330, 415, 494, 554, 659, 740];
      const arpNote = arpNotes[beat % 8];
      playTone(ctx, master, arpNote, "triangle", beatTime + beatDur * 0.5, 0.20, 0.15);

      // コード（4ビートごと交替）
      if (beat % 4 === 0) {
        const chordBeat = Math.floor(beat / 4) % 4;
        const chords: number[][] = [
          [110, 138, 165], // Am
          [98,  123, 147], // Gm
          [116, 138, 175], // Fm
          [104, 131, 155], // Em
        ];
        const chord = chords[chordBeat];
        chord.forEach((f) => playTone(ctx, master, f, "sine", beatTime, beatDur * 3.5, 0.09));
      }
    },
    [playTone]
  );

  const startBGM = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    beatCountRef.current = 0;

    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    masterRef.current = master;

    const BPM = 130;
    const beatDur = 60 / BPM;
    const LOOKAHEAD = 0.2; // 200ms先読み
    let nextBeatTime = ctx.currentTime + 0.05;

    const scheduler = () => {
      while (nextBeatTime < ctx.currentTime + LOOKAHEAD) {
        scheduleBeat(ctx, master, nextBeatTime, beatCountRef.current);
        beatCountRef.current++;
        nextBeatTime += beatDur;
      }
      schedulerRef.current = window.setTimeout(scheduler, 80);
    };
    scheduler();
  }, [getCtx, scheduleBeat]);

  const stopBGM = useCallback(() => {
    isPlayingRef.current = false;
    if (schedulerRef.current !== null) {
      clearTimeout(schedulerRef.current);
      schedulerRef.current = null;
    }
    if (masterRef.current) {
      try {
        masterRef.current.gain.linearRampToValueAtTime(0, (ctxRef.current?.currentTime ?? 0) + 0.3);
      } catch { /* silent */ }
      masterRef.current = null;
    }
  }, []);

  const pauseBGM = useCallback(() => {
    if (schedulerRef.current !== null) {
      clearTimeout(schedulerRef.current);
      schedulerRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  return { startBGM, stopBGM, pauseBGM };
}
