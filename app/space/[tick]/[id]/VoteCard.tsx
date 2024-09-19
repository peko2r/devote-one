'use client'
import { toastError, toastSuccess } from '@/context/MessageContext'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { useVote } from '@/context/VoteContext'
import { getAddressBalance, vote } from '@/utils/http/services'
import { Images } from '@/utils/images'
import { useRequest } from 'ahooks'
import { Popover } from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
  tick: string
  id: number
  type: number // 1单选 2多选
  proposal_vote_id: number
  blockHeight: number
  options: Array<{
    content: string
    id: number
    proposal_vote_id: number
    quantity: number
  }>
}

const VoteCard = ({ tick, id, proposal_vote_id, options, type, blockHeight }: Props) => {
  const [selected, setSelected] = useState<number[]>([])
  const { account, connected, active } = useUnisatWallet()

  const { data: balance, run: getBalance } = useRequest(getAddressBalance, {
    manual: true,
  })

  useEffect(() => {
    if (account) getBalance({ address: account, tick, block_height: blockHeight })
  }, [account, tick])

  const { initRate, initList } = useVote()

  const { run, loading } = useRequest(vote, {
    manual: true,
    onSuccess(res) {
      if (res.message === 'Success') {
        setSelected([])
        toastSuccess('Vote successfully')
        initRate({ tick, id })
        if (account) {
          initList({ tick, id, address: account, limit: 6, page: 1 })
        } else {
          initList({ tick, id, limit: 6, page: 1 })
        }
        // window.location.reload()
      } else {
        toastError('Vote failed')
      }
    },
  })

  return (
    <>
      {account && (
        <div className="w-[51.75rem] p-[1.5rem] text-[#202020] font-medium border-solid border-[1px] border-[#E6E7EB] rounded-[.5rem] mt-[2.5rem]">
          <h3 className="mb-[1rem]">Cast your vote</h3>
          {options.map(({ id, content }) => {
            return (
              <div
                onClick={() => {
                  if (type === 1) {
                    if (selected.includes(id)) {
                      setSelected([])
                    } else {
                      setSelected([id])
                    }
                  }
                  if (type === 2) {
                    if (selected.includes(id)) {
                      setSelected(selected.filter((item) => item !== id))
                    } else {
                      setSelected([...selected, id])
                    }
                  }
                }}
                key={id}
                className={`w-[48.75rem] h-[2.5rem] border-[#E6E7EB] border-solid border-[1px] rounded-[.5rem] my-[.5rem] pl-[1.5rem] pr-[1rem] flex items-center cursor-pointer hover:border-[#F5BD07] justify-between ${
                  selected.includes(id) && 'border-[#F5BD07]'
                }`}
              >
                {content.length > 50 ? (
                  <Popover content={content}>{`${content.slice(0, 47)}...`}</Popover>
                ) : (
                  <>{content}</>
                )}

                {selected.includes(id) && (
                  <Image src={Images.ICON.SELECTED_SVG} alt="selected" width={20} height={20} />
                )}
              </div>
            )
          })}
          <div
            key={id}
            onClick={() => {
              if (!connected) return active()
              if (+(balance?.data || 0) === 0) return toastError('Do not have enough balance')
              if (selected.length === 0 || loading) return
              run({ tick, id, proposal_vote_id, address: account, proposal_vote_option_ids: selected })
            }}
            className={`w-[48.75rem] h-[2.5rem] border-[#E6E7EB] border-solid border-[1px] rounded-[.5rem] my-[.5rem] flex justify-center items-center mt-[1rem] ${
              selected.length === 0 || loading
                ? 'bg-[#F0F0F0] text-[#ccc] cursor-not-allowed'
                : 'bg-[#F5BD07] text-[#202020] cursor-pointer'
            }`}
          >
            {connected ? 'Vote' : 'Connect Wallet'}
          </div>
        </div>
      )}
    </>
  )
}

export default VoteCard
