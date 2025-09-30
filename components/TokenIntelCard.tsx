'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ResponsiveContainer, AreaChart, Area, YAxis, Tooltip,
} from 'recharts'

type Props = {
  address: `0x${string}`   // 0xD2e5...24Df
  coingeckoPlatform?: 'ethereum' // estensibile
}

type PricePt = { t: number; p: number }

export default function TokenIntelCard({ address, coingeckoPlatform='ethereum' }: Props){
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string| null>(null)
  const [meta, setMeta] = useState<any>(null)   // name,symbol,decimals,totalSupply
  const [price, setPrice] = useState<number| null>(null)
  const [chg24h, setChg24h] = useState<number| null>(null)
  const [hist, setHist] = useState<PricePt[]>([])
  const [holders, setHolders] = useState<number| null>(null)

  useEffect(()=>{
    let cancel = false
    async function load(){
      try{
        setLoading(true); setErr(null)
        // 1) meta on-chain
        const metaRes = await fetch(`/api/token?address=${address}`)
        if(!metaRes.ok) throw new Error('meta fetch failed')
        const metaJson = await metaRes.json()
        if(cancel) return
        setMeta(metaJson)

        // 2) price + 24h + history (CoinGecko — no API key)
        // current
        const priceRes = await fetch(
          `https://api.coingecko.com/api/v3/simple/token_price/${coingeckoPlatform}?contract_addresses=${address}&vs_currencies=usd&include_24hr_change=true`,
          { next: { revalidate: 120 } }
        )
        const priceJson = await priceRes.json()
        const row = priceJson[address.toLowerCase()]
        setPrice(row?.usd ?? null)
        setChg24h(row?.usd_24h_change ?? null)

        // history 7d (hourly)
        const histRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coingeckoPlatform}/contract/${address}/market_chart?vs_currency=usd&days=7`,
          { next: { revalidate: 600 } }
        )
        const hJson = await histRes.json()
        const series: PricePt[] = (hJson?.prices ?? []).map((p:[number, number])=>({ t:p[0], p:p[1] }))
        setHist(series)

        // 3) holders (opzionale — se server ha impostato Etherscan key)
        const holdRes = await fetch(`/api/token/holders?address=${address}`)
        if(holdRes.ok){
          const hj = await holdRes.json()
          setHolders(hj?.holders ?? null)
        }
      }catch(e:any){
        if(!cancel) setErr(e?.message || 'error')
      }finally{
        if(!cancel) setLoading(false)
      }
    }
    load()
    return ()=>{ cancel = true }
  },[address, coingeckoPlatform])

  const mcap = useMemo(()=>{
    if(!meta?.totalSupply || !price) return null
    // totalSupply already normalized to units (not wei)
    return Number(meta.totalSupply) * price
  },[meta, price])

  return (
    <div className="card relative overflow-hidden">
      {/* bordo synth + alone */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-white/10" />
      <div className="absolute -inset-12 opacity-[0.07] bg-[radial-gradient(60%_60%_at_70%_30%,#00ffd166_0%,transparent_60%)]" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">Token Intelligence</div>
          <div className="mt-1 text-xs text-slate-400">
            Live on-chain & market telemetry for your token.
          </div>
        </div>
        <Link
          href={`https://etherscan.io/token/${address}`}
          target="_blank"
          className="pill glow-gold text-xs"
        >
          Etherscan ↗
        </Link>
      </div>

      {/* header line */}
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="miniStat">
          <div className="label">Price</div>
          <div className="value">
            {price != null ? `$${price.toLocaleString(undefined,{maximumFractionDigits:6})}` : '—'}
          </div>
          <div className={`badge mt-1 ${ (chg24h ?? 0) >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {chg24h != null ? `${chg24h.toFixed(2)}% 24h` : ''}
          </div>
        </div>

        <div className="miniStat">
          <div className="label">Total Supply</div>
          <div className="value">
            {meta?.totalSupply != null ? meta.totalSupply.toLocaleString() : '—'}
            <span className="text-xs ml-1 text-slate-400">{meta?.symbol ?? ''}</span>
          </div>
          <div className="sub">{meta?.name ?? ''}</div>
        </div>

        <div className="miniStat">
          <div className="label">Market Cap (est.)</div>
          <div className="value">
            {mcap != null ? `$${Math.round(mcap).toLocaleString()}` : '—'}
          </div>
          <div className="sub">Price × Supply</div>
        </div>

        <div className="miniStat">
          <div className="label">Holders</div>
          <div className="value">{holders != null ? holders.toLocaleString() : '—'}</div>
          <div className="sub">via Etherscan</div>
        </div>
      </div>

      {/* sparkline */}
      <div className="mt-4 h-28 rounded-xl bg-[#141618] border border-white/10 px-2 py-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hist}>
            <YAxis hide domain={['dataMin','dataMax']} />
            <defs>
              <linearGradient id="gToken" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D9896A" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#D9896A" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="p" stroke="#D9896A" fill="url(#gToken)" strokeWidth={2}/>
            <Tooltip contentStyle={{
              background:'#141618', border:'1px solid rgba(255,255,255,.08)', borderRadius:12,
              color:'#E5E7EB'
            }} labelFormatter={(x)=> new Date(x as number).toLocaleString()} formatter={(v)=>[`$${(v as number).toFixed(6)}`,'Price']}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* footer */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <code className="px-2 py-1 rounded-md bg-black/30 border border-white/10">{address}</code>
        {meta?.decimals != null && <span>• {meta.decimals} decimals</span>}
        {meta?.symbol && <span>• Ticker: {meta.symbol}</span>}
        <Link href={`/assets?token=${address}`} className="underline-animate">View related assets</Link>
      </div>

      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-black/10 backdrop-blur-[1px]">
          <div className="pill glow-teal">Loading token…</div>
        </div>
      )}
      {err && (
        <div className="mt-3 text-[12px] text-rose-300">
          {err}
        </div>
      )}
    </div>
  )
}
