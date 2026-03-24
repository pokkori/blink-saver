"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const BlinkGame = dynamic(() => import("@/components/BlinkGame"), { ssr: false });
export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #050510, #0a0a2e)" }}>
        <div className="text-5xl animate-pulse">️</div>
      </div>
    }>
      <BlinkGame />
    </Suspense>
  );
}
