'use client'

import { toastError, toastSuccess } from '@/context/MessageContext'
import { useSpace } from '@/context/SpaceContext'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { addProposal, getAddressBalance } from '@/utils/http/services'
import { useCreation, useRequest } from 'ahooks'
import { useRouter } from 'next/navigation'

import React, { useEffect } from 'react'

const NewBtnGroup = () => {
  const tick = useCreation(() => location.pathname.split('/')[2], [location.pathname])
  const router = useRouter()

  const { connected, active, account } = useUnisatWallet()
  const { fields } = useSpace()

  const { data: balance, run: getBalance } = useRequest(getAddressBalance, {
    manual: true,
  })

  useEffect(() => {
    if (account) getBalance({ address: account, tick })
  }, [account, tick])

  const { run: addNewProposal, loading } = useRequest(addProposal, {
    manual: true,
    onSuccess(res) {
      if (res?.code !== 0) return toastError(res?.message)
      toastSuccess('Published successfully')
      router.push(`/space/${tick}`)
    },
    onError(err) {
      console.error(err)
      toastError('Publish failed')
    },
  })
  return (
    <div>
      <div
        onClick={() => router.push(`/space/${tick}/preview`)}
        className="w-[15rem] h-[2.5rem] cursor-pointer rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] flex justify-center items-center text-[#202020] font-medium mb-2 hover:bg-[#F5BD07]"
      >
        Preview
      </div>
      {connected ? (
        <div
          className={`w-[15rem] h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] flex justify-center items-center text-[#202020] font-medium ${
            fields.title !== '' &&
            fields.vote_type !== 0 &&
            fields.start_time !== 0 &&
            fields.end_time !== 0 &&
            fields.snapshot_time !== 0 &&
            fields.options[0].content !== '' &&
            fields.options[1].content !== '' &&
            +(balance?.data || 0) > 0 &&
            !loading
              ? 'cursor-pointer hover:bg-[#F5BD07]'
              : 'cursor-not-allowed bg-[#F0F0F0] text-[#CCCCCC]'
          }`}
          onClick={() => {
            if (loading) return
            if (+(balance?.data || 0) === 0) return
            if (fields.snapshot_time > fields.start_time)
              return toastError('The start time must be after the current snapshot time')
            if (fields.start_time > fields.end_time)
              return toastError('The end time must be greater than the start time')
            if (
              fields.title !== '' &&
              fields.vote_type !== 0 &&
              fields.start_time !== 0 &&
              fields.end_time !== 0 &&
              fields.snapshot_time !== 0 &&
              fields.options[0].content !== '' &&
              fields.options[1].content !== '' &&
              account
            ) {
              addNewProposal({
                ...fields,
                options: fields.options.filter((i) => i.content.trim() !== ''),
                address: account,
                tick,
              })
              localStorage.removeItem('fields')
            }
          }}
        >
          Publish
        </div>
      ) : (
        <div
          className={`w-[15rem] h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] flex justify-center items-center text-[#202020] font-medium cursor-pointer hover:bg-[#F5BD07]`}
          onClick={active}
        >
          Connect Wallet
        </div>
      )}
    </div>
  )
}

export default NewBtnGroup
