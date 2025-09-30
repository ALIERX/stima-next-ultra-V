// components/SynthBottomNav.tsx
"use client";
import Link from "next/link";

const Item = ({ href, label, active=false, icon }: any) => (
  <Link href={href} className="flex flex-col items-center gap-2">
    <div className="w-9 h-9 rounded-full grid place-items-center border border-black bg-gradient-to-tr from-[#7B7063] to-[#54483F]">
      {icon ?? <div className="w-4 h-0.5 bg-gradient-to-r from-[#74695C] to-[#4F4239] rounded" />}
    </div>
    <span className={`text-[14px] tracking-wide ${active ? "text-copper-400 font-bold" : "text-[#867C72]"}`}>{label}</span>
  </Link>
);

export default function SynthBottomNav(){
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 synth-card px-6 py-4 rounded-[25px] border border-dashed border-[#7B61FF]">
      <div className="flex items-center gap-8">
        <Item href="/" label="home" active />
        <Item href="/assets" label="cards" />
        <Item href="/mint" label="money" />
        <Item href="/club" label="club" />
      </div>
    </nav>
  );
}
