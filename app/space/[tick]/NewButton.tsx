'use client'
import { useSpace } from '@/context/SpaceContext'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  tick: string
}
const NewButton = ({ tick }: Props) => {
  const router = useRouter()
  const { connected, active } = useUnisatWallet()

  const { setFields } = useSpace()
  return (
    <button
      type="button"
      onClick={() => {
        if (!connected) return active()
        setFields({
          title: '',
          options: [{ content: '' }, { content: '' }],
          vote_type: 0,
          snapshot_time: 0,
          start_time: 0,
          end_time: 0,
        })
        localStorage.removeItem('fields')
        router.push(`/space/${tick}/new`)
      }}
      className={`w-[11.75rem] h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] text-[#202020] font-medium flex justify-center items-center cursor-pointer hover:bg-[#F5BD07] hover:border-none`}
    >
      New Proposal
    </button>
  )
}

export default NewButton
