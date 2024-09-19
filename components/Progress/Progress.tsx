'use client'
import { formatCount } from '@/utils/format'
import { useCreation } from 'ahooks'
import { Popover } from 'antd'
import React from 'react'

type Props = {
  options: Array<{ content: string; id: number; proposal_vote_id: number; quantity: number }>
}

const Progress = ({ options }: Props) => {
  const total = useCreation(() => options.reduce((acc, cur) => acc + cur.quantity, 0), [options])
  const tick = useCreation(() => location.pathname.split('/')[2], [location.pathname])
  if (options.length > 3) {
    return (
      <>
        {options
          .sort(function (a, b) {
            return b.quantity - a.quantity
          })
          .map((option) => {
            return (
              <div
                className="w-[53.75rem] h-[2.5rem] mb-[.5rem] mx-auto border-none flex justify-between items-center relative"
                key={option.id}
              >
                <div className=" absolute top-[.51rem] left-4 flex items-center">
                  <div className="text-[#202020] text-[.9375rem] font-medium mr-[.56rem]">
                    {option.content.length > 50 ? (
                      <Popover content={option.content}>{`${option.content.slice(0, 50)}...`}</Popover>
                    ) : (
                      option.content
                    )}
                  </div>
                  <div className="text-[#737373] text-[.9375rem] font-medium">
                    {formatCount(option?.quantity || 0)} {tick}
                  </div>
                </div>
                <div
                  className={`rounded-lg bg-[#F0F0F0] h-full`}
                  style={{ width: `${(option.quantity / total) * 48}rem` }}
                ></div>
                <div className="text-[#F5BD07] font-medium text-[.9375rem]">
                  {total === 0 ? '0%' : `${((option?.quantity / total) * 100).toFixed(2)}%`}
                </div>
              </div>
            )
          })
          .slice(0, 1)}
      </>
    )
  } else {
    return (
      <>
        {options
          .sort(function (a, b) {
            return b.quantity - a.quantity
          })
          .map((option) => {
            return (
              <div
                className="w-[53.75rem] h-[2.5rem] mb-[.5rem] mx-auto border-none flex justify-between items-center relative"
                key={option.id}
              >
                <div className=" absolute top-[.51rem] left-4 flex items-center">
                  <div className="text-[#202020] text-[.9375rem] font-medium mr-[.56rem]">
                    {option.content.length > 50 ? (
                      <Popover content={option.content}>{`${option.content.slice(0, 50)}...`}</Popover>
                    ) : (
                      option.content
                    )}
                  </div>
                  <div className="text-[#737373] text-[.9375rem] font-medium">
                    {formatCount(option?.quantity || 0)} {tick}
                  </div>
                </div>
                <div
                  className={`rounded-lg bg-[#F0F0F0] h-full`}
                  style={{ width: `${(option.quantity / total) * 48}rem` }}
                ></div>
                <div className="text-[#F5BD07] font-medium text-[.9375rem]">
                  {total === 0 ? '0%' : `${((option?.quantity / total) * 100).toFixed(2)}%`}
                </div>
              </div>
            )
          })}
      </>
    )
  }
}

export default Progress
