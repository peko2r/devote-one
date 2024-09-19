import { NextResponse } from 'next/server'
import { Item, PageData } from '@/context/SpaceContext'
import { MockItems } from '@/utils/mock'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ? searchParams.get('page')! : '1')
  const limit = parseInt(searchParams.get('limit') ? searchParams.get('limit')! : '1')
  searchParams.get('address')
  const tick = searchParams.get('tick')

  const data: PageData = {
    items: MockItems.filter((item, index) => {
      if (tick) {
        return item.tick === tick || item.tick_show === tick
      } else {
        return index <= page * limit && index >= (page - 1) * limit
      }
    }),
    total: MockItems.length,
    page: 1,
  }
  return NextResponse.json({ data })
}
