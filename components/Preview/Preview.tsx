'use client'

import DescView from '@/app/space/[tick]/[id]/DescView'
import { useSpace } from '@/context/SpaceContext'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { getEllipsisStr } from '@/utils/format'
import { Images } from '@/utils/images'
import { Progress } from 'antd'
import dayjs from 'dayjs'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { getAddressBalance } from '@/utils/http/services'

const LocalizeFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(LocalizeFormat)

type Props = {
  tick: string
}

const Preview = ({ tick }: Props) => {
  const { fields } = useSpace()
  const router = useRouter()

  const { account, connected } = useUnisatWallet()
  const { data: balance, run: getBalance } = useRequest(getAddressBalance, {
    manual: true,
  })

  useEffect(() => {
    if (account) getBalance({ address: account, tick })
  }, [account, tick])

  const renderRightArea = () => {
    return (
      <div className="flex-1">
        <div className="w-[20rem] border-solid border-[1px] border-[#E6E7EB] rounded-[.5rem] p-[1.5rem] mb-[1.5rem]">
          <h3 className="text-[#202020] font-bold mb-[1rem]">Information</h3>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] font-[.875rem] font-medium">Voting Rules</div>
            <div className="font-[.875rem] font-medium">
              {fields.vote_type === 1 ? 'Multiple Choice' : 'Multiple Answers '}
            </div>
          </div>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] font-[.875rem] font-medium">Start Time</div>
            <div className="font-[.875rem] font-medium">{dayjs.unix(fields.start_time).format('lll')}</div>
          </div>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] font-[.875rem] font-medium">End Time</div>
            <div className="font-[.875rem] font-medium">{dayjs.unix(fields.end_time).format('lll')}</div>
          </div>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] font-[.875rem] font-medium">Snapshot</div>
            <div className="flex justify-between gap-[5px]">
              <div className="font-[.875rem] font-medium">{fields.snapshot_time.toLocaleString()}</div>
            </div>
          </div>
        </div>
        {fields.options.some((i) => i.content !== '') && (
          <div className="w-[20rem] border-solid border-[1px] border-[#E6E7EB] rounded-[.5rem] p-[1.5rem]">
            <h3 className="text-[#202020] font-bold mb-[1rem]">Current results</h3>
            {fields.options.map((i: any) => {
              if (i.content.trim() === '') return null
              return (
                <div className="my-[.5rem]" key={i.content}>
                  <div className="flex justify-between text-[#202020] font-medium text-[.875rem]">
                    <div>{i.content.length > 12 ? `${i.content.slice(0, 9)}...` : i.content}</div>
                    <div className="flex justify-between gap-[8px]">
                      <div>{0 + ` ${tick.toUpperCase()}`}</div>
                      <div>0%</div>
                    </div>
                  </div>
                  <Progress showInfo={false} strokeColor="#F5BD07" percent={0} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="w-[51.75rem]">
        <div
          className={`flex items-center cursor-pointer hover:text-[#F5BD07] font-medium text-[0.9375rem] text-lg ${
            connected && +(balance?.data || 0) > 0 ? 'mb-[2.12rem]' : 'mb-[1rem]'
          }`}
          onClick={() => router.back()}
        >
          <ArrowLeftOutlined style={{ marginRight: 5 }} />
          Back
        </div>
        <div
          className={`w-[5rem] h-[1.5rem] rounded-xl bg-[#1DE3B6] text-[#fff] text-sm font-medium flex items-center justify-center`}
        >
          Active B
        </div>
        <h1 className="text-[#202020] text-[1.75rem] font-bold mt-[1rem] mb-[.5rem]">{fields.title}</h1>
        <div className="flex justify-between mb-[2rem]">
          <div className="flex gap-2 text-[#737373] font-medium text-[.875rem]">
            <Image src={Images.ICON.DEFAULT_TICK_PNG} alt="ordinal" width={24} height={24} />
            <div>{tick} by </div>
            <Image
              src={Images.HOME.DEFAULT_USER_PNG}
              alt="user-avatar"
              width={24}
              height={24}
              className="rounded-full"
            />{' '}
            <div>{getEllipsisStr(account || 'creator')}</div>
          </div>
        </div>
        <DescView description={fields.description || ''} />
      </div>
      {renderRightArea()}
    </>
  )
}

export default Preview
