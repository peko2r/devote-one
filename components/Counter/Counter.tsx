'use client'

import React from 'react'
import { useSpace } from '@/context/SpaceContext'

export function numberFormat(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  } else {
    return num?.toString()
  }
}

const Counter = () => {
  const { total } = useSpace()

  return (
    <p className="text-sm text-[#9F9F9F] font-medium">
      <span className="text-[#ecbf42] mr-1">BRC20</span>({numberFormat(total)} Space)
    </p>
  )
}

const SingleCounter = ({ count }: { count: number }) => {
  return <div className="mb-[1.5rem] text-[#9F9F9F] font-medium text-sm">{numberFormat(count)} Members</div>
}

export { Counter, SingleCounter }
