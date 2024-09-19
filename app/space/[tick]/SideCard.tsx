'use client'

import SpaceCard from '@/components/Space/SpaceCard'
import { PageData, useSpace, Result, Item } from '@/context/SpaceContext'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { ENV } from '@/utils/env'
import { Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'

type Props = {
  tick: string
}
const PAGE_SIZE = 12

const SideCard = ({ tick }: Props) => {
  const { account, connected } = useUnisatWallet()

  const [data, setData] = useState<Item>()
  useEffect(() => {
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
      setData(infiniteListData.list[0])
    }
    getSpaceList(1, PAGE_SIZE, tick, account)
  }, [account, tick])

  if (!data) return <Skeleton active />

  return (
    <div className="sticky top-[6.5rem]">
      <SpaceCard data={data} showSubTitle />
    </div>
  )
}

export default SideCard
