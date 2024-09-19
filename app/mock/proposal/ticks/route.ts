import { NextResponse } from 'next/server'
import { PageData } from '@/context/SpaceContext'

export const GET = async (req: Request) => {
  const data: PageData = {
    items: [
      {
        tick: 'test1',
        tick_show: 'test1',
        sort: 1,
        address_count: 1,
        create_time: 20240512,
        icon: 'https://img2.baidu.com/it/u=109890283,3403544649&fm=253&fmt=auto&app=120&f=JPEG?w=750&h=500',
        join: true,
      },
    ],
    total: 10,
    page: 1,
  }
  return NextResponse.json({ data })
}
