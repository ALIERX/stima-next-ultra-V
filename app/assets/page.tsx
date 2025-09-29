import data from '../data/assets.json'
import AssetCard from '@/components/AssetCard'

export const dynamic = 'force-static'

export default function AssetsPage(){
  return <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{data.map((a:any)=>(<AssetCard key={a.id} a={a}/>))}</section>
}
