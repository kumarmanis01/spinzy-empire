import { NextResponse } from 'next/server'
import { invokeCapability } from '@/core-engine/capability_surface'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { capability, payload } = body
    const result = await invokeCapability(capability, payload)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
