'use client'
import { useFX } from './SoundFXProvider'
import { useEffect } from 'react'

export default function SoundSwitch(){
  const { enabled, toggle, click } = useFX()
  // piccolo feedback quando si abilita
  useEffect(()=>{ if(enabled) click() }, [enabled]) // eslint-disable-line
  return (
    <button
      onClick={toggle}
      className={`pill ${enabled ? 'glow-teal' : ''}`}
      title={enabled ? 'Sound on (click to mute)' : 'Sound off (click to enable)'}
    >
      {enabled ? '🔊 Sound' : '🔇 Muted'}
    </button>
  )
}
