'use client'

import React from 'react'
import { ProposalItem } from './ProposalList'
import { Images } from '@/utils/images'
import Image from 'next/image'
import { getEllipsisStr, getTimeDifference } from '@/utils/format'
import Progress from '@/components/Progress/Progress'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { useCreation } from 'ahooks'
import DeleteBtn from '@/components/DeleteBtn/DeleteBtn'
import { useRouter } from 'next/navigation'
import { Marked } from '@ts-stack/markdown'
import { useSpace } from '@/context/SpaceContext'
import dayjs from 'dayjs'

const LocalizeFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(LocalizeFormat)

const ProposalCard = ({
  address,
  status,
  title,
  description,
  end_time,
  id,
  options,
  mutate,
  data,
  create_time,
}: ProposalItem) => {
  const tick = useCreation(() => location.pathname.split('/')[2], [location.pathname])
  const { account } = useUnisatWallet()
  const { isMy } = useSpace()
  const router = useRouter()

  return (
    <div
      className="w-[56.75rem] p-[1.5rem] border-[1px] border-solid border-[#E6E7EB] cursor-pointer rounded-[.5rem] mb-[1.5rem] hover:border-[#F5BD07]"
      onClick={() => router.push(`/space/${tick}/${id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[.5rem] text-[#737373] text-sm font-medium">
          {isMy ? (
            <>Creation : {dayjs((create_time * 1000).valueOf()).format('YYYY/MM/DD LT')}</>
          ) : (
            <>
              <Image
                src={Images.HOME.DEFAULT_USER_PNG}
                alt="user-avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
              <div>{getEllipsisStr(address)}</div>
            </>
          )}
        </div>
        <div
          className={`h-[1.5rem] py-2 px-4 rounded-xl ${
            status === 1 ? 'bg-[#1DE3B6]' : status === 2 ? 'bg-[#ccc]' : 'bg-[#F141EE]'
          } text-[#fff] text-sm font-medium flex items-center justify-center`}
        >
          {status === 1 ? 'Active' : status === 2 ? 'Not started' : 'Closed'}
        </div>
      </div>
      <div className="mt-[1.22rem] mb-[.75rem] text-[1.25rem] flex gap-2">
        <div className="text-[#202020] font-bold max-w-[50rem] line-clamp-2">{title}</div>
        {account === address && <DeleteBtn id={id} tick={tick} mutate={mutate} data={data} address={account} />}
      </div>
      <div
        className="show-region markdownStyle prose mb-[1rem] line-clamp-2 max-w-[56.75rem] text-[#9F9F9F]"
        dangerouslySetInnerHTML={{
          __html: Marked.parse(description),
        }}
      />
      {status !== 1 && options && <Progress options={options} />}
      <div className="mt-[1.25rem] text-[#9F9F9F] text-[.875rem] font-medium">{getTimeDifference(end_time)}</div>
    </div>
  )
}

export default ProposalCard
