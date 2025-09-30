// /app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
]

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const address = url.searchParams.get('address')
  if (!address) return NextResponse.json({ error: 'missing address' }, { status: 400 })

  // usa RPC pubblico se non imposti ALCHEMY/INFURA
  const rpc =
    process.env.ALCHEMY_RPC ||
    process.env.INFURA_RPC ||
    'https://cloudflare-eth.com'

  const provider = new ethers.JsonRpcProvider(rpc)
  const erc20 = new ethers.Contract(address, ERC20_ABI, provider)

  try {
    const [name, symbol, decimals, totalSupplyRaw] = await Promise.all([
      erc20.name(),
      erc20.symbol(),
      erc20.decimals(),
      erc20.totalSupply(),
    ])
    const totalSupply = Number(ethers.formatUnits(totalSupplyRaw, decimals))
    return NextResponse.json({ name, symbol, decimals, totalSupply })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'rpc error' }, { status: 500 })
  }
}
