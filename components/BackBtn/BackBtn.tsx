'use client'

import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { getAddressBalance } from '@/utils/http/services'
import { Images } from '@/utils/images'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useCreation, useRequest } from 'ahooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const BackBtn = () => {
  const tick = useCreation(() => location.pathname.split('/')[2], [location.pathname])
  const router = useRouter()
  const { connected, account } = useUnisatWallet()

  const { data: balance, run: getBalance } = useRequest(getAddressBalance, {
    manual: true,
  })

  useEffect(() => {
    if (account) getBalance({ address: account, tick })
  }, [account, tick])
  return (
    <div>
      <div
        className={`flex items-center cursor-pointer hover:text-[#F5BD07] font-medium text-[0.9375rem] text-lg ${
          connected && +(balance?.data || 0) > 0 ? 'mb-[2.12rem]' : 'mb-[1rem]'
        }`}
        onClick={() => {
          router.back()
        }}
      >
        <ArrowLeftOutlined style={{ marginRight: 5 }} />
        Back
      </div>
      {!connected && (
        <div className="text-[#F5BD07] w-[56.75rem] h-[2.5rem] border-[1px] border-dashed border-[#F5BD07] flex items-center rounded-[.5rem] pl-[1rem] text-[.9375rem] mb-[2rem]">
          <Image src={Images.ICON.WARN_SVG} alt="warn" width={24} height={24} className="pr-[.5rem]" />
          You need to connect your wallet to submit a proposal.
        </div>
      )}
      {connected && +(balance?.data || 0) === 0 && (
        <div className="text-[#F5BD07] w-[56.75rem] h-[2.5rem] border-[1px] border-dashed border-[#F5BD07] flex items-center rounded-[.5rem] pl-[1rem] text-[.9375rem] mb-[2rem]">
          <Image src={Images.ICON.WARN_SVG} alt="warn" width={24} height={24} className="pr-[.5rem]" />
          You need to hold at least 1 token in your wallet to cast a vote.
        </div>
      )}
    </div>
  )
}

export default BackBtn
