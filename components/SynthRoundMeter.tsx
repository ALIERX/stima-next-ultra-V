"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  value: number;           // 0..1 (percentuale) oppure 0..100 se usePercent=true
  size?: number;           // px
  label?: string;
  minText?: string;        // "300"
  maxText?: string;        // "900"
  centerText?: string;     // "836"
  usePercent?: boolean;
  gradient?: "green" | "copper";
};

export default function SynthRoundMeter({
  value,
  size = 126,
  label,
  minText = "300",
  maxText = "900",
  centerText,
  usePercent = false,
  gradient = "green",
}: Props) {
  const v = Math.max(0, Math.min(1, usePercent ? value / 100 : value));
  const angle = Math.round(v * 360);

  const ringGrad =
    gradient === "green"
      ? `conic-gradient(from 110.98deg at 50% 50%, rgba(0,0,0,0) 0deg, rgba(2,3,1,0) ${Math.max(
          angle - 275,
          0
        )}deg, #B5C950 360deg)`
      : `conic-gradient(from 110.98deg at 50% 50%, rgba(0,0,0,0) 0deg, rgba(2,3,1,0) ${Math.max(
          angle - 275,
          0
        )}deg, #D9896A 360deg)`;

  const outer = size;
  const mid = size - 29;     // ~97 per 126
  const ring = size - 38;    // 88
  const inner = size - 58;   // 68

  // Posizioniamo il "dot" alla fine della progressione
  const dotRadius = (ring / 2) - 3;
  const theta = ((angle - 110.98) * Math.PI) / 180; // stessa origine del gradient
  const cx = outer / 2 + dotRadius * Math.cos(theta);
  const cy = outer / 2 + dotRadius * Math.sin(theta);

  return (
    <div className="synth-card p-4 relative select-none" style={{ width: outer, height: outer }}>
      {label && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[12px] text-white3">{label}</div>}

      {/* outer ring (sottile bordo) */}
      <div
        className="absolute rounded-full"
        style={{
          width: mid,
          height: mid,
          left: (outer - mid) / 2,
          top: 2,
          border: "0.5px solid #343739",
        }}
      />

      {/* progress conic */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: ring,
          height: ring,
          left: (outer - ring) / 2,
          top: (outer - ring) / 2 - 3,
          background: ringGrad,
          filter: "drop-shadow(0 4px 13px rgba(0,0,0,.5))",
        }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* inner */}
      <div
        className="absolute rounded-full"
        style={{
          width: inner,
          height: inner,
          left: (outer - inner) / 2,
          top: (outer - inner) / 2,
          background: "#212426",
          border: "0.5px solid #343739",
          boxShadow: "0 4px 13px rgba(0,0,0,0.5)",
        }}
      />

      {/* center value */}
      <div
        className="absolute font-bold"
        style={{
          width: inner,
          left: (outer - inner) / 2,
          top: (outer - 22) / 2,
          textAlign: "center",
          fontSize: 18,
          color: "#D5D7D6",
          lineHeight: "22px",
          letterSpacing: ".005em",
        }}
      >
        {centerText ?? Math.round(v * 1000)}
      </div>

      {/* dot in punta */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6, height: 6, left: cx - 3, top: cy - 3,
          background: gradient === "green" ? "#BDD253" : "#D9896A",
        }}
      />

      {/* min/max ticks */}
      <div className="absolute text-[8px] text-graphite" style={{ left: 13, top: outer - 27 }}>
        <div className="w-[2px] h-[2px] bg-graphite absolute left-[18px] top-[-2px]" />
        {minText}
      </div>
      <div className="absolute text-[8px] text-graphite" style={{ right: 13, top: outer - 27 }}>
        <div className="w-[2px] h-[2px] bg-graphite absolute right-[-7px] top-[-2px]" />
        {maxText}
      </div>
    </div>
  );
}
