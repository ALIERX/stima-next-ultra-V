"use client";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function SynthButton({
  children,
  icon,
  pressed,
  onClick,
}: PropsWithChildren<{ icon?: ReactNode; pressed?: boolean; onClick?: () => void }>) {
  const [isDown, setDown] = useState(false);
  const state = pressed || isDown ? "pressed" : "idle";
  return (
    <button
      className="synth-btn"
      data-state={state}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onMouseLeave={() => setDown(false)}
      onClick={onClick}
    >
      <span className="btn-icon grid place-items-center">{icon ?? <span className="w-2 h-2 rounded-full bg-copper-300/40" />}</span>
      <span className="text-[16px]">{children}</span>
    </button>
  );
}
