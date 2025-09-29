'use client'
import React, {createContext, useContext, useMemo, useRef, useState} from 'react'
type Ctx = { enabled:boolean, toggle:()=>void, click:()=>void, success:()=>void, vibrate:(ms?:number)=>void }
const C = createContext<Ctx>({enabled:true, toggle:()=>{}, click:()=>{}, success:()=>{}, vibrate:()=>{}})
export function useFX(){ return useContext(C) }
export default function SoundFXProvider({children}:{children:React.ReactNode}){
  const [enabled, setEnabled] = useState(true)
  const a = useRef<HTMLAudioElement|null>(null)
  function ensure(){ if(!a.current) a.current = new Audio('/sfx/click.wav') }
  function click(){ if(!enabled) return; ensure(); a.current!.currentTime=0; a.current!.play().catch(()=>{}); vibrate(10) }
  function success(){ if(!enabled) return; ensure(); a.current!.play().catch(()=>{}); vibrate(20) }
  function vibrate(ms=8){ if(typeof navigator!=='undefined' && 'vibrate' in navigator) (navigator as any).vibrate(ms) }
  const value = useMemo(()=>({ enabled, toggle:()=>setEnabled(v=>!v), click, success, vibrate }),[enabled])
  return <C.Provider value={value}>{children}</C.Provider>
}
