'use client'

import { getVoteInfo, getVotesList } from '@/utils/http/services'
import { useCreation, useRequest } from 'ahooks'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

export type VoteItem = { content: string; quantity: number; id: number; proposal_vote_id: number }
export type VoteListItem = {
  address: string
  create_time: number
  option_content: string
  proposal_vote_id: number
  proposal_vote_option_id: number
  quantity: number
  loadingForList: boolean
}

const VoteContext = createContext<{
  voteRate?: Array<VoteItem>
  totalVote: number
  initRate: (...params: any) => void
  initList: (...params: any) => void
  voteList?: Array<VoteListItem>
  totalItem: number
  currentPage: number
  setTotalItem: Dispatch<SetStateAction<number>>
  setCurrentPage: Dispatch<SetStateAction<number>>
  loadingForList: boolean
  resetList: (...params: any) => void
}>({
  voteRate: [],
  initRate: () => {},
  totalVote: 0,
  voteList: [],
  initList: () => {},
  totalItem: 0,
  currentPage: 0,
  setTotalItem() {},
  setCurrentPage() {},
  loadingForList: false,
  resetList() {},
})

export default function VoteContextProvider(props: { children?: ReactNode }) {
  const [totalItem, setTotalItem] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [voteList, setVoteList] = useState<any[]>([])
  const { data: voteRate, run: setVoteRate } = useRequest<
    { code: number; message: string; data: VoteItem[] },
    [{ tick: string; id: number }]
  >(getVoteInfo, {
    manual: true,
  })
  const totalVote = useCreation(() => (voteRate?.data || []).reduce((acc, cur) => acc + cur.quantity, 0), [voteRate])

  const { run: getList, loading } = useRequest(getVotesList, {
    manual: true,
    onSuccess(res) {
      setVoteList(res?.data?.items)
      setTotalItem(res?.data?.total)
      setCurrentPage(res?.data?.page)
    },
  })

  const { run: reset } = useRequest(getVotesList, {
    manual: true,
    onSuccess(res) {
      setVoteList(res?.data?.items)
      setTotalItem(res?.data?.total)
      setCurrentPage(res?.data?.page)
    },
  })

  return (
    <VoteContext.Provider
      value={{
        voteRate: voteRate?.data,
        initRate: setVoteRate,
        totalVote,
        voteList: voteList,
        initList: getList,
        currentPage,
        totalItem,
        setTotalItem,
        setCurrentPage,
        loadingForList: loading,
        resetList: reset,
      }}
    >
      {props.children}
    </VoteContext.Provider>
  )
}

export function useVote() {
  return useContext(VoteContext)
}
