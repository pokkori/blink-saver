"use client";
import dynamic from "next/dynamic";
const BlinkGame = dynamic(() => import("@/components/BlinkGame"), { ssr: false });
export default function GamePage() { return <BlinkGame />; }
