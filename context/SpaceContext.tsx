'use client'
import { useDebounce, useInfiniteScroll, useMemoizedFn } from 'ahooks'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'
import { useUnisatWallet } from './UnisatWalletContext'
import { getSpaceListUrl } from '@/utils/path'

export type Item = {
  tick: string
  tick_show: string
  sort: number
  address_count: number
  create_time: number
  icon?: string
  join: boolean
}

export type PageData = { items: Array<Item>; total: number; page: number }

export interface Result<T> {
  list: Array<T>
  total: number
  page: number
  limit?: number
}

const PAGE_SIZE = 15
const getSpaceList = async (
  page: number,
  pageSize: number = PAGE_SIZE,
  tick?: string | null,
  address?: string | null,
) => {
  let response
  if (!tick && !address) {
    response = await fetch(getSpaceListUrl(page, pageSize), { cache: 'no-store' })
  } else if (tick && !address) {
    response = await fetch(getSpaceListUrl(page, pageSize, undefined, tick), {
      cache: 'no-store',
    })
  } else if (!tick && address) {
    response = await fetch(getSpaceListUrl(page, pageSize, address, undefined), {
      cache: 'no-store',
    })
  } else {
    response = await fetch(getSpaceListUrl(page, pageSize, address!, tick!), { cache: 'no-store' })
  }
  const res: PageData = (await response.json()).data
  console.log('getSpaceList', res)
  const infiniteListData: Result<Item> = {
    list: res.items,
    total: res.total,
    page: res.page,
  }
  return infiniteListData
}

const SpaceContext = createContext<{
  search: string
  spaceList: Item[]
  handleSearch: (search: string) => void
  loading: boolean
  loadMore: () => void
  loadingMore: boolean
  total: number
  page: number
  reload: () => void
  reloadAsync: () => any
  mutate: (data: Result<Item>) => void
  fields: {
    title: string
    description?: string
    options: Array<{ content: string }>
    vote_type: number
    snapshot_time: number
    start_time: number
    end_time: number
  }
  setFields: Dispatch<
    SetStateAction<{
      title: string
      description?: string | undefined
      options: Array<{
        content: string
      }>
      vote_type: number
      snapshot_time: number
      start_time: number
      end_time: number
    }>
  >
  isMy: boolean
  setIsMy: Dispatch<SetStateAction<boolean>>
}>({
  search: '',
  spaceList: [],
  handleSearch() {},
  loading: false,
  loadMore() {},
  loadingMore: false,
  total: 0,
  page: 0,
  reload() {},
  reloadAsync: async () => {},
  mutate() {},
  fields: {
    title: '',
    options: [{ content: '' }, { content: '' }],
    vote_type: 0,
    snapshot_time: 0,
    start_time: 0,
    end_time: 0,
  },
  setFields() {},
  isMy: false,
  setIsMy() {},
})

export default function SpaceContextProvider(props: { children?: ReactNode }) {
  const [search, setSearch] = useState('')
  const [isMy, setIsMy] = useState(false)
  const { connected, account } = useUnisatWallet()
  const [fields, setFields] = useState<{
    title: string
    description?: string
    options: Array<{ content: string }>
    vote_type: number
    snapshot_time: number
    start_time: number
    end_time: number
  }>({
    title: JSON.parse(localStorage?.getItem('fields') || '{}')?.title || '',
    options: JSON.parse(localStorage?.getItem('fields') || '{}')?.options || [{ content: '' }, { content: '' }],
    vote_type: JSON.parse(localStorage?.getItem('fields') || '{}')?.vote_type || 0,
    snapshot_time: JSON.parse(localStorage?.getItem('fields') || '{}')?.snapshot_time || 0,
    start_time: JSON.parse(localStorage?.getItem('fields') || '{}')?.start_time || 0,
    end_time: JSON.parse(localStorage?.getItem('fields') || '{}')?.end_time || 0,
  })

  const debounceValue = useDebounce(search, { wait: 500 })
  const { data, loading, loadMore, loadingMore, reload, reloadAsync, mutate } = useInfiniteScroll<Result<Item>>(
    (d) => {
      const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1
      if (connected) {
        if (debounceValue) {
          return getSpaceList(page, PAGE_SIZE, debounceValue, account)
        } else {
          return getSpaceList(page, PAGE_SIZE, undefined, account)
        }
      } else {
        if (debounceValue) {
          return getSpaceList(page, PAGE_SIZE, debounceValue)
        } else {
          return getSpaceList(page)
        }
      }
    },
    {
      reloadDeps: [debounceValue, account, connected],
    },
  )

  const handleSearch = useMemoizedFn((search: string) => {
    setSearch(search)
  })

  return (
    <SpaceContext.Provider
      value={{
        search,
        spaceList: data?.list || [],
        handleSearch,
        loadMore,
        loading,
        loadingMore,
        total: data?.total || 0,
        page: data?.page || 0,
        reload,
        reloadAsync,
        mutate,
        fields,
        setFields,
        isMy,
        setIsMy,
      }}
    >
      {props.children}
    </SpaceContext.Provider>
  )
}

export function useSpace() {
  return useContext(SpaceContext)
}
