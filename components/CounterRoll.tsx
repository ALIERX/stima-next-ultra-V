'use client'
import React from 'react'
import { useSpring, animated } from '@react-spring/web'
export default function CounterRoll({ value=0, prefix='', suffix='', decimals=2, duration=800 }:{value?:number,prefix?:string,suffix?:string,decimals?:number,duration?:number}){
  const { val } = useSpring({ from:{val:0}, to:{val:Number(value)||0}, config:{ duration } })
  return <animated.span className="font-mono tabular-nums">{val.to(v=>`${prefix}${Number(v).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`)}</animated.span>
}
