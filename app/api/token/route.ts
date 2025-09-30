import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, formatUnits } from 'viem'
import { mainnet } from 'viem/chains'

const erc20 = {
  abi: [
    { "type":"function","name":"name","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}]},
    { "type":"function","name":"symbol","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}]},
    { "type":"function","name":"decimals","stateMutability":"view","inputs":[],"outputs":[{"type":"uint8"}]},
    { "type":"function","name":"totalSupply","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}]},
  ] as const
}

export async function GET(req: NextRequest){
  const address = (new URL(req.url)).searchParams.get('address') as `0x${string}` | null
  if(!address) return NextResponse.json({ error:'missing address' }, { status:400 })

  const client = createPublicClient({ chain: mainnet, transport: http(process.env.ANVIL_RPC || undefined) })
  try{
    const [name, symbol, decimals, totalSupplyRaw] = await Promise.all([
      client.readContract({ address, abi: erc20.abi, functionName:'name' }),
      client.readContract({ address, abi: erc20.abi, functionName:'symbol' }),
      client.readContract({ address, abi: erc20.abi, functionName:'decimals' }),
      client.readContract({ address, abi: erc20.abi, functionName:'totalSupply' }),
    ]) as [string, string, number, bigint]

    const totalSupply = Number(formatUnits(totalSupplyRaw, decimals))
    return NextResponse.json({ name, symbol, decimals, totalSupply })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'rpc error' }, { status:500 })
  }
}
