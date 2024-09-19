import { Counter } from '@/components/Counter/Counter'
import Search from '@/components/Search/Search'
import SpaceList from '@/components/Space/SpaceList'

export default function Home() {
  const renderHomeTitle = () => {
    return (
      <div className="flex justify-between items-center mb-[1.5rem] gap-3">
        <Search />
        <Counter />
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="">
        {renderHomeTitle()}
        <SpaceList />
      </div>
    </main>
  )
}
