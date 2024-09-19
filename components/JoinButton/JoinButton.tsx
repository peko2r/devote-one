'use client'
import { toastSuccess } from '@/context/MessageContext'
import { Item, PageData, Result } from '@/context/SpaceContext'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { ENV } from '@/utils/env'
import { useHover } from 'ahooks'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  tick: string
  address?: string | null
  showSubTitle?: boolean
  changeCount: any
  count: number
}

const PAGE_SIZE = 15

const JoinButton = ({ tick, address, showSubTitle, changeCount, count }: Props) => {
  const { connected, active, account } = useUnisatWallet()
  const [joinStat, setJoinStat] = useState(false)
  const [loading, setLoading] = useState(false)

  const getSpaceList = async (
    page: number,
    pageSize: number = PAGE_SIZE,
    tick?: string | null,
    address?: string | null,
  ) => {
    let response
    if (!tick && !address && !connected) {
      response = await fetch(`${ENV.backend}/proposal/ticks?limit=${pageSize}&page=${page}`)
    } else if (tick && !address && !connected) {
      response = await fetch(`${ENV.backend}/proposal/ticks?limit=${pageSize}&page=${page}&tick=${tick}`)
    } else if (!tick && address && connected) {
      response = await fetch(`${ENV.backend}/proposal/ticks?limit=${pageSize}&page=${page}&address=${address}`)
    } else {
      response = await fetch(
        `${ENV.backend}/proposal/ticks?limit=${pageSize}&page=${page}&tick=${tick}&address=${address}`,
      )
    }
    const res: PageData = (await response.json()).data
    const infiniteListData: Result<Item> = {
      list: res.items,
      total: res.total,
      page: res.page,
    }
    setJoinStat(infiniteListData.list[0].join)
  }

  useEffect(() => {
    setLoading(true)
    connected ? getSpaceList(1, PAGE_SIZE, tick, account) : getSpaceList(1, PAGE_SIZE, tick)
    setLoading(false)
  }, [account, tick, connected])

  const ref = useRef(null)
  const isHover = useHover(ref)
  const joinSpace = async () => {
    setLoading(true)
    await fetch(`${ENV.backend}/proposal/ticks/join`, {
      method: 'POST',
      body: JSON.stringify({ tick, address }),
    })
    await getSpaceList(1, PAGE_SIZE, tick, account)
    changeCount(count + 1)
    setLoading(false)
  }

  const leaveSpace = async () => {
    setLoading(true)
    await fetch(`${ENV.backend}/proposal/ticks/leave`, {
      method: 'POST',
      body: JSON.stringify({ tick, address }),
    })
    await getSpaceList(1, PAGE_SIZE, tick, account)
    changeCount(count - 1)
    setLoading(false)
  }

  return (
    <>
      {joinStat ? (
        <div
          ref={ref}
          onClick={(e) => {
            if (loading) return
            e.stopPropagation()
            toastSuccess('You have left the space')
            leaveSpace()
          }}
          className={`${
            showSubTitle ? 'w-[12rem]' : 'w-[7.5rem]'
          } h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] flex items-center bg-[#E6E7EB] justify-center mx-auto hover:bg-[#d22c2c] hover:border-none cursor-pointer`}
        >
          {loading ? 'Waiting...' : isHover ? 'Leave' : 'Joined'}
        </div>
      ) : (
        <>
          <div
            onClick={(e) => {
              if (loading) return
              e.stopPropagation()
              if (!connected) return active()
              toastSuccess('You have joined the space')
              joinSpace()
            }}
            className={`${
              showSubTitle ? 'w-[12rem]' : 'w-[7.5rem]'
            } h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] flex items-center justify-center mx-auto hover:bg-[#F5BD07] hover:border-none cursor-pointer`}
          >
            {loading ? 'Waiting...' : 'Join'}
          </div>
        </>
      )}
    </>
  )
}

export default JoinButton
