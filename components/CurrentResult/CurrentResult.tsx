'use client'

import { useVote } from '@/context/VoteContext'
import { formatCount } from '@/utils/format'
import { Popover, Progress } from 'antd'
import React, { useEffect } from 'react'

type Props = {
  tick: string
  id: number
}

const CurrentResult = ({ tick, id }: Props) => {
  const { voteRate, totalVote, initRate } = useVote()
  // function numberFormat(num: number): string {
  //   if (num >= 1000000) {
  //     return (num / 1000000).toFixed(0) + 'M'
  //   } else if (num >= 1000) {
  //     return (num / 1000).toFixed(0) + 'K'
  //   } else {
  //     return num.toString()
  //   }
  // }

  useEffect(() => {
    if (tick && tick !== '' && id) {
      initRate({ tick, id })
    }
  }, [tick, id])

  return (
    <div className="w-[20rem] border-solid border-[1px] border-[#E6E7EB] rounded-[.5rem] p-[1.5rem]">
      <h3 className="text-[#202020] font-bold mb-[1rem]">Current results</h3>
      {(voteRate || []).map((i) => (
        <div className="my-[.5rem]" key={i.content}>
          <div className="flex justify-between text-[#202020] font-medium text-[.875rem]">
            <div>
              {i.content.length > 12 ? (
                <Popover content={i.content}>{`${i.content.slice(0, 9)}...`}</Popover>
              ) : (
                i.content
              )}
            </div>
            <div className="flex justify-between gap-[8px]">
              <div>{formatCount(i.quantity) + ` ${tick.toUpperCase()}`}</div>
              <div>{totalVote === 0 ? '0%' : `${((i.quantity / totalVote) * 100).toFixed(2)}%`}</div>
            </div>
          </div>
          <Progress
            showInfo={false}
            strokeColor="#F5BD07"
            percent={totalVote === 0 ? 0 : Number(((i.quantity / totalVote) * 100).toFixed(2))}
          />
        </div>
      ))}
    </div>
  )
}

export default CurrentResult
