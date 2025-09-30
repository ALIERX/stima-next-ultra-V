// components/SynthButton.tsx
'use client'
import {motion} from 'framer-motion'
export default function SynthButton({
  children, icon, pressed=false, className=''
}:{children:React.ReactNode; icon?:React.ReactNode; pressed?:boolean; className?:string;}){
  return (
    <motion.button
      whileTap={{scale:.98}}
      className={`inline-flex items-center justify-center gap-3 px-4 h-12 rounded-[100px]
                  border ${pressed?'border-white/5':'border-black/10'} card-raised ${className}`}
      style={{
        background: `linear-gradient(95deg, rgba(0,0,0,${pressed?'.12':'0'}) 3%, rgba(0,0,0,${pressed?'0':'.12'}) 95%), #212426`
      }}
    >
      {icon && <span className="grid place-items-center w-9 h-9 rounded-full bg-[#212426] inset">{icon}</span>}
      <span className={`${pressed?'text-[rgba(249,211,180,.40)]':'text-[#F9D3B4]'} text-[16px] font-medium tracking-[.005em]`}>{children}</span>
    </motion.button>
  )
}
