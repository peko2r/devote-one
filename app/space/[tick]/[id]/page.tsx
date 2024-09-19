import Container from '@/components/Container/Container'
import { ENV } from '@/utils/env'
import { getEllipsisStr } from '@/utils/format'
import { Images } from '@/utils/images'
import { Breadcrumb, Skeleton } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import DescView from './DescView'
import VoteCard from './VoteCard'
import dayjs from 'dayjs'
import LinkIcon from './LinkIcon'
import VoteList from './VoteList'
import CurrentResult from '@/components/CurrentResult/CurrentResult'

const LocalizeFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(LocalizeFormat)

type Props = { params: { id: number; tick: string } }

type ReturnData = {
  code: number
  message: string
  data: {
    id: number
    title: string
    description: string
    address: string
    vote_type: number
    block_height: number
    start_time: number
    end_time: number
    status: number
    create_time: number
    total_quantity: number
    snapshot_time: number
    options: Array<{
      content: string
      id: number
      proposal_vote_id: number
      quantity: number
    }>
  }
}
const fetchData = async (tick: string, id: string | number): Promise<ReturnData> => {
  const response = await fetch(`${ENV.backend}/proposal/${tick}/votes/${id}`, { cache: 'no-store' })
  const res = await response.json()
  return res
}

export async function generateMetadata({ params, tick }: { params: any; tick: string }) {
  const id = params.id
  const { data } = await fetchData(tick, id)

  return {
    title: `${data.title} | Devote`,
    description: 'Projects based on Ordinals BRC20 voting.',
  }
}

const Page = async ({ params }: Props) => {
  const { id, tick } = params
  const { data } = await fetchData(tick, id)

  const renderLeftArea = () => {
    return (
      <div className="w-[51.75rem]">
        <div
          className={`h-[1.5rem] w-[7rem] py-2 px-4 rounded-xl ${
            data.status === 1 ? 'bg-[#1DE3B6]' : data.status === 2 ? 'bg-[#ccc]' : 'bg-[#F141EE]'
          } text-[#fff] text-sm font-medium flex items-center justify-center`}
        >
          {data.status === 1 ? 'Active' : data.status === 2 ? 'Not started' : 'Closed'}
        </div>
        <h1 className="text-[#202020] text-[1.75rem] font-bold mt-[1rem] mb-[.5rem]">{data.title}</h1>
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
            <div>{getEllipsisStr(data.address)}</div>
          </div>
        </div>
        <DescView description={data.description} />
        {data.status === 1 && (
          <VoteCard
            tick={tick}
            id={id}
            proposal_vote_id={+id}
            options={data.options}
            type={data.vote_type}
            blockHeight={data?.block_height}
          />
        )}
        <VoteList tick={tick} id={id} />
      </div>
    )
  }

  const renderRightArea = () => {
    return (
      <div className="flex-1">
        <div className="w-[20rem] border-solid border-[1px] border-[#E6E7EB] rounded-[.5rem] p-[1.5rem] mb-[1.5rem]">
          <h3 className="text-[#202020] font-bold mb-[1rem]">Information</h3>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] text-[.875rem]">Voting Rules</div>
            <div className="text-[.875rem]">{data.vote_type === 1 ? 'Multiple Choice' : 'Multiple Answers'}</div>
          </div>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] text-[.875rem]">Start Time</div>
            <div className="text-[.875rem]">{dayjs.unix(data.start_time).format('lll')}</div>
          </div>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] text-[.875rem]">End Time</div>
            <div className="text-[.875rem]">{dayjs.unix(data.end_time).format('lll')}</div>
          </div>
          <div className="flex justify-between my-[.5rem]">
            <div className="text-[#9F9F9F] text-[.875rem]">Snapshot</div>
            <div className="flex justify-between gap-[5px]">
              <div className="text-[.875rem]">
                {data.block_height.toLocaleString() === '0'
                  ? dayjs.unix(data.snapshot_time).format('lll')
                  : data.block_height.toLocaleString()}
              </div>
              {data.block_height.toLocaleString() !== '0' && <LinkIcon snapShot={data.block_height} />}
            </div>
          </div>
        </div>
        <CurrentResult tick={tick} id={id} />
      </div>
    )
  }

  if (!data.title) return <Skeleton active />

  return (
    <Container>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href={`/space/${tick}`} className="font-medium">
                {tick}
              </Link>
            ),
          },
          {
            title: (
              <div className="font-medium">{data.title.length > 88 ? `${data.title.slice(0, 85)}...` : data.title}</div>
            ),
          },
        ]}
        separator=">"
      />
      <div className="mt-[2.5rem] flex gap-[2rem]">
        {renderLeftArea()}
        {renderRightArea()}
      </div>
    </Container>
  )
}

export default Page
