//模拟100条数据
import { Item } from '@/context/SpaceContext'

const total = 100
let MockItems: Array<Item> = []
for (let i = 0; i < total; i++) {
  MockItems.push({
    tick: `tick${i}`,
    tick_show: `show${i}`,
    sort: i,
    address_count: Math.ceil(Math.random() * 100),
    create_time: i,
    icon: `https://picsum.photos/seed/${i}sfa/200`,
    join: i % 2 === 0,
  })
}

export { MockItems }
