'use client'
import React, { useState } from 'react'
import { Item, useSpace } from '@/context/SpaceContext'
import { SingleCounter } from '@/components/Counter/Counter'
import JoinButton from '../JoinButton/JoinButton'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { useRouter } from 'next/navigation'
import { Popover, Skeleton } from 'antd'

type Props = {
  data: Item
  showSubTitle?: boolean
}

const SpaceCard = ({ data, showSubTitle }: Props) => {
  const [count, setCount] = useState(data?.address_count || 0)
  const router = useRouter()
  const { account, connected } = useUnisatWallet()
  const { setIsMy, isMy } = useSpace()

  if (!data?.tick_show && !data?.tick) return <Skeleton active />
  return (
    <div
      onClick={() => router.push(`/space/${data.tick}`)}
      className={`${
        showSubTitle ? 'w-[15rem] h-[20.375rem]' : 'w-[14rem] h-[17.875rem]'
      } rounded-lg border-[1px] border-solid border-[#E6E7EB] text-center py-[2rem] cursor-pointer hover:scale-105 transition duration-300 hover:border-[#F5BD07] mb-4`}
    >
      {data?.icon ? (
        <img src={data.icon} alt="icon" className="mx-auto w-[5.5rem] h-[5.5rem]" />
      ) : (
        <div className="mx-auto w-[5.5rem] h-[5.5rem] rounded-full bg-black text-white font-medium flex justify-center items-center text-4xl">
          {data?.tick.slice(0, 1).toLocaleUpperCase()}
        </div>
      )}

      {data.tick_show.length > 16 ? (
        <Popover content={data.tick_show} placement="bottom">
          <div className="mt-[1.5rem] mb-[.1rem] text-[#202020] font-bold text-xl">{`${data.tick_show.slice(
            0,
            12,
          )}...`}</div>
        </Popover>
      ) : (
        <div className="mt-[1.5rem] mb-[.1rem] text-[#202020] font-bold text-xl">{data.tick_show}</div>
      )}
      <SingleCounter count={count} />
      <JoinButton
        tick={data.tick_show}
        address={account}
        showSubTitle={showSubTitle}
        changeCount={setCount}
        count={count}
      />
      {showSubTitle && connected && (
        <div
          onClick={() => {
            setIsMy(!isMy)
          }}
          className="mt-[1.5rem] text-[#9F9F9F] font-medium text-base hover:text-[#F5BD07] cursor-pointer"
        >
          {isMy ? 'All Proposals' : 'My Proposals'}
        </div>
      )}
    </div>
  )
}

export default SpaceCard
