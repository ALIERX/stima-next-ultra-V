import assets from './data/assets.json'
import CounterRoll from '@/components/CounterRoll'
import Ticker from '@/components/Ticker'
import NavDonut from '@/components/NavDonut'
import MiniSpark from '@/components/MiniSpark'
import HeroBanner from '@/components/HeroBanner'
import OracleSatellite from '@/components/OracleSatellite'
import CoverFlow3D from '@/components/CoverFlow3D'
import InfoTip from '@/components/InfoTip'

function sum(xs:number[]){ return xs.reduce((a,b)=>a+b,0) }

export default function Home(){
  const total = sum(assets.map(a=>a.value))
  const byCat = Array.from(assets.reduce((m:any,a:any)=>m.set(a.category,(m.get(a.category)||0)+a.value), new Map()))
    .map(([k,v]:any)=>({ name: k[0].toUpperCase()+k.slice(1), value: total? v/total*100 : 0 }))

  const top5 = [...assets].sort((a,b)=>b.value-a.value).slice(0,5)

  const featured = assets.slice(0,5).map(a=>({
    id: a.id, image: a.image, title: `${a.brand}`, subtitle: a.name
  }))

  return (
    <>
      <HeroBanner />

      {/* KPI row */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card">
          <div className="text-xs text-slate-400">Total Vault NAV <InfoTip text="Sum of all appraised assets currently in custody (mock). Updates daily @ 00:00 UTC." /></div>
          <div className="text-2xl font-semibold">€ <CounterRoll value={total} decimals={0}/></div>
          <MiniSpark data={[10,11,13,12,14,15,16,17,16,18,19,20]}/>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400">Minted supply (demo) <InfoTip text="Supply minted vs NAV. Real mint becomes active once Sepolia ENV are set." /></div>
          <div className="text-2xl font-semibold"><CounterRoll value={total/1000} suffix=" STIMA" decimals={2}/></div>
          <div className="badge mt-2">Deterministic @ 00:00 UTC</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400">Categories</div>
          <div className="text-2xl font-semibold">{byCat.length}</div>
          <div className="text-xs text-slate-400 mt-1">Watch, Art, Car, Gem, Wine, Sneaker</div>
        </div>
        <OracleSatellite status="Online" />
      </section>

      {/* Ticker + Donut */}
      <section className="grid md:grid-cols-2 gap-3">
        <div className="card">
          <div className="text-sm font-medium mb-2">Market Ticker</div>
          <Ticker items={byCat.map(c=>c.name)} />
        </div>
        <div className="card">
          <div className="text-sm font-medium mb-2">NAV Composition</div>
          <NavDonut data={byCat} />
        </div>
      </section>

      {/* Cover Flow + News */}
      <section className="grid md:grid-cols-2 gap-3">
        <CoverFlow3D items={featured} />
        <div className="card">
          <div className="text-sm font-medium mb-2">News (placeholder)</div>
          <ul className="text-sm space-y-2">
            <li>• Sotheby’s sets new record in modern art evening sale.</li>
            <li>• Rare Rolex Daytona achieves 7-figure hammer price.</li>
            <li>• Burgundy rally pauses after three months of gains.</li>
            <li>• Blue-chip classic car index hits decade high.</li>
          </ul>
          <div className="text-xs text-slate-500 mt-2">Soon: curated feed + sources.</div>
        </div>
      </section>
    </>
  )
}
