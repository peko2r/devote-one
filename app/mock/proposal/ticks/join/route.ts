import { NextResponse } from 'next/server'
import { MockItems } from '@/utils/mock'

export const POST = async (req: Request) => {
  const body = await req.json()
  const { tick, address } = body
  for (let i = 0; i < MockItems.length; i++) {
    if (MockItems[i].tick === tick || MockItems[i].tick_show === tick) {
      MockItems[i].join = true
      MockItems[i].address_count++
      break
    }
  }
  console.log('join successful!')
  return NextResponse.json({ success: true })
}
