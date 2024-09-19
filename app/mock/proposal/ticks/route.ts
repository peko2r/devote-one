import { NextResponse } from 'next/server'
import { Item, PageData } from '@/context/SpaceContext'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ? searchParams.get('page')! : '1')
  const limit = parseInt(searchParams.get('limit') ? searchParams.get('limit')! : '1')
  searchParams.get('address')
  searchParams.get('tick')

  //模拟100条数据
  const total = 100
  let items: Array<Item> = []
  for (let i = 0; i < total; i++) {
    items.push({
      tick: `tick${i}`,
      tick_show: `show${i}`,
      sort: i,
      address_count: Math.ceil(Math.random()),
      create_time: i,
      icon: `https://picsum.photos/seed/${i}sfa/200`,
      join: i % 2 === 0
    })
  }

  const data: PageData = {
    items: items.filter((_, index) => index <= page * limit && index >= (page - 1) * limit),
    total: total,
    page: 1
  }
  return NextResponse.json({ data })
}
