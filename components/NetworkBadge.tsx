'use client'
const N = process.env.NEXT_PUBLIC_NETWORK_NAME || 'Demo'
const color = N.toLowerCase().includes('sepolia') ? 'bg-yellow-400' :
              N.toLowerCase().includes('main')   ? 'bg-emerald-400' : 'bg-slate-400'

export default function NetworkBadge(){
  return (
    <span className="pill flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-xs">{N}</span>
    </span>
  )
}
