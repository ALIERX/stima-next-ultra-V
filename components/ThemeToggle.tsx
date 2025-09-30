'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle(){
  const [mode, setMode] = useState<'dark'|'midnight'>('dark')

  useEffect(()=>{
    const html = document.documentElement
    if(mode === 'dark'){
      html.classList.add('dark')
      html.style.setProperty('--accent', '#00FFD1')
    }else{
      html.classList.add('dark')
      html.style.setProperty('--accent', '#B48C58') // oro
    }
  }, [mode])

  return (
    <button
      onClick={()=> setMode(m => m === 'dark' ? 'midnight' : 'dark')}
      className={`pill ${mode==='midnight' ? 'glow-gold' : ''}`}
      title="Toggle accent theme"
    >
      {mode==='midnight' ? '🌙 Midnight Gold' : '✨ Crypto Teal'}
    </button>
  )
}
