"use client";
import React from "react";

const orbs = [
  { size: 340, left: 8,  top: 5,  color: "rgba(14,165,233,0.14)", duration: 9,  delay: 0,   blur: 90  },
  { size: 260, left: 78, top: 8,  color: "rgba(241,245,249,0.08)", duration: 12, delay: 1.5, blur: 75  },
  { size: 300, left: 45, top: 55, color: "rgba(6,182,212,0.12)",   duration: 8,  delay: 0.8, blur: 85  },
  { size: 220, left: 88, top: 60, color: "rgba(14,165,233,0.10)",  duration: 7,  delay: 2.2, blur: 65  },
  { size: 380, left: 5,  top: 72, color: "rgba(30,58,138,0.18)",   duration: 13, delay: 0.3, blur: 100 },
  { size: 180, left: 58, top: 22, color: "rgba(6,182,212,0.09)",   duration: 6,  delay: 1.0, blur: 60  },
  { size: 280, left: 28, top: 42, color: "rgba(241,245,249,0.07)", duration: 10, delay: 3.0, blur: 80  },
  { size: 240, left: 68, top: 82, color: "rgba(30,58,138,0.14)",   duration: 8,  delay: 0.6, blur: 72  },
];

const OrbBackground = React.memo(function OrbBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes eyeOrbFloat {
          0%   { transform: translate(0, 0) scale(1);       opacity: 0.5; }
          20%  { transform: translate(12px, -20px) scale(1.06); opacity: 0.85; }
          50%  { transform: translate(-8px, -36px) scale(0.96); opacity: 0.65; }
          75%  { transform: translate(20px, -12px) scale(1.03); opacity: 0.80; }
          100% { transform: translate(0, 0) scale(1);       opacity: 0.5; }
        }
      `}</style>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            animation: `eyeOrbFloat ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            willChange: "transform, opacity",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
});

export default OrbBackground;
