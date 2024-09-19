'use client'

import { Result, useSpace } from '@/context/SpaceContext'
import { ENV } from '@/utils/env'
import { useInfiniteScroll } from 'ahooks'
import React, { useEffect } from 'react'
import ProposalCard from './ProposalCard'
import { Skeleton } from 'antd'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { LoadingOutlined } from '@ant-design/icons'

type Props = {
  tick: string
}

export type ProposalItem = {
  description: string
  address: string
  block_height?: number
  create_time: number
  end_time: number
  id: number
  start_time: number
  status: number
  title: string
  total_quantity: number
  vote_type: number
  options?: Array<{
    content: string
    id: number
    proposal_vote_id: number
    quantity: number
  }>
  mutate: any
  data: any
}

const PAGE_SIZE = 15
async function getData(tick: string, limit: number = 12, page: number = 1) {
  const response = await fetch(`${ENV.backend}/proposal/${tick}/votes?limit=${limit}&page=${page}`, {
    cache: 'no-cache',
  })
  const res = (await response.json()).data
  const infiniteListData: Result<ProposalItem> = {
    list: res.items,
    total: res.total,
    page: res.page,
  }
  return infiniteListData
}

const ProposalList = ({ tick }: Props) => {
  const { account } = useUnisatWallet()
  const { isMy, setIsMy } = useSpace()
  const { data, loading, loadMore, loadingMore, mutate } = useInfiniteScroll<Result<ProposalItem>>(
    (d) => {
      const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1
      return getData(tick, PAGE_SIZE, page)
    },
    {
      reloadDeps: [tick],
    },
  )

  useEffect(() => setIsMy(false), [])
  if (loading) return <Skeleton active />
  if (data) {
    return (
      <>
        <div>
          {isMy
            ? data?.list
                .filter((item) => item.address === account)
                .map((item) => {
                  return <ProposalCard key={item.id} {...item} mutate={mutate} data={data} />
                })
            : data?.list.map((item) => {
                return <ProposalCard key={item.id} {...item} mutate={mutate} data={data} />
              })}
        </div>
        {!isMy && data.list.length < data.total && (
          <div className="mt-[1.5rem] flex items-center justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="w-[10.25rem] h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] text-[#202020] font-medium hover:border-none"
            >
              {loadingMore ? (
                <div className="w-full h-full flex items-center justify-center rounded-[1.25rem]">
                  {/* <Image src={Images.ICON.LOADING_SVG} alt="loading" width={18} height={18} /> */}
                  <LoadingOutlined style={{ color: '#ecbf42' }} />
                </div>
              ) : (
                <div className="hover:bg-[#F5BD07] w-full h-full flex items-center justify-center rounded-[1.25rem]">
                  Load More
                </div>
              )}
            </button>
          </div>
        )}
        {isMy &&
          data.list.filter((item) => item.address === account).length !== 0 &&
          data.list.filter((item) => item.address === account).length < data.total && (
            <div className="mt-[1.5rem] flex items-center justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="w-[10.25rem] h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] text-[#202020] font-medium hover:border-none"
              >
                {loadingMore ? (
                  <div className="w-full h-full flex items-center justify-center rounded-[1.25rem]">
                    {/* <Image src={Images.ICON.LOADING_SVG} alt="loading" width={18} height={18} /> */}
                    <LoadingOutlined style={{ color: '#ecbf42' }} />
                  </div>
                ) : (
                  <div className="hover:bg-[#F5BD07] w-full h-full flex items-center justify-center rounded-[1.25rem]">
                    Load More
                  </div>
                )}
              </button>
            </div>
          )}
      </>
    )
  }
}

export default ProposalList
