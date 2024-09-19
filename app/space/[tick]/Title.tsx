'use client'
import { useSpace } from '@/context/SpaceContext'
import React from 'react'

const Title = () => {
  const { isMy } = useSpace()

  return <div className="text-[#202020] text-[2rem] font-bold">{isMy ? 'My Proposals' : 'Proposals'}</div>
}

export default Title
