'use client'

import { useUnisatWallet } from '@/context/UnisatWalletContext'
import React, { useEffect, useState } from 'react'
import { List, Popover } from 'antd'
import Image from 'next/image'
import { Images } from '@/utils/images'
import { getEllipsisStr } from '@/utils/format'
import { numberFormat } from '@/components/Counter/Counter'
import { useVote } from '@/context/VoteContext'

type Props = {
  tick: string
  id: number
}

const VoteList = ({ tick, id }: Props) => {
  const { account, connected } = useUnisatWallet()
  const { voteList, totalVote, initList, totalItem, currentPage, loadingForList, resetList } = useVote()
  const [cur, setCur] = useState(0)

  useEffect(() => {
    if (account && account !== '') {
      initList({ tick, id, address: account, limit: 6 * (cur + 1), page: 1 })
    } else {
      initList({ tick, id, limit: 6 * (cur + 1), page: 1 })
    }
    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    // In real scene, you can using public method of react-virtualized:
    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    window.dispatchEvent(new Event('resize'))
  }, [account, cur])

  const onLoadMore = () => {
    setCur(cur + 1)
  }

  const loadMore =
    voteList && !loadingForList && totalItem > 6 && voteList.length < totalItem ? (
      <div
        className="hover:text-[#ecbf42] py-[1.5rem] text-[#202020] font-me  cursor-pointer flex justify-center items-center"
        onClick={onLoadMore}
      >
        See More
      </div>
    ) : null

  return (
    <div className="mt-[2.5rem]">
      <List
        header={
          <h3 className="font-bold">
            <span>Votes</span>
            <span className="px-[.37rem] h-[1.25rem] rounded-[.625rem] bg-[#E6E7EB] text-center text-[#737373] text-[.75rem] inline-block ml-[.31rem]">
              {totalVote}
            </span>
          </h3>
        }
        bordered
        loading={loadingForList}
        loadMore={loadMore}
        dataSource={voteList}
        renderItem={(item) => (
          <List.Item>
            <div className="flex items-center justify-between">
              <div className="flex items-center  gap-[6px] min-w-[8.1875rem]">
                <Image
                  src={Images.HOME.DEFAULT_USER_PNG}
                  alt="user-avatar"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                {item.address === account ? 'You' : getEllipsisStr(item.address)}
              </div>
              <div className="ml-[8.5rem] w-[15.25rem]">
                {item?.option_content?.length > 40 ? (
                  <Popover content={item.option_content}>{`${item.option_content.slice(0, 37)}...`}</Popover>
                ) : (
                  <>{item.option_content}</>
                )}
              </div>
              <div className="w-[16rem] text-right">{numberFormat(item.quantity) + ` ${tick.toUpperCase()}`}</div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}

export default VoteList
