'use client'

import { Images } from '@/utils/images'
import Image from 'next/image'
import { useFocusWithin } from 'ahooks'
import React, { useRef } from 'react'
import { useSpace } from '@/context/SpaceContext'

/**
 * Search
 * 搜索框组件
 * @constructor
 */
const Search = () => {
  const inputRef = useRef(null)
  // 判断是否处于焦点内
  const isFocusWithin = useFocusWithin(inputRef)

  const { search, handleSearch } = useSpace()

  return (
    <div className="relative">
      <Image
        src={Images.COMMON.SEARCH_SVG}
        alt="icon"
        width={12}
        height={12}
        className="absolute top-[15px] left-[8px]"
      />
      <input
        ref={inputRef}
        value={search}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        placeholder="Search"
        className={`w-[20rem] pl-6 h-[2.5rem] text-sm rounded-[.5rem] outline-none border-[1px] border-solid ${
          isFocusWithin ? 'border-[#F5BD07]' : 'border-[#E6E7EB]'
        }`}
      />
    </div>
  )
}

export default Search
