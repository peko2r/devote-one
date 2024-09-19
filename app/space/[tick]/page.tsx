import SideCard from './SideCard'
import React from 'react'
import ProposalList from './ProposalList'
import NewButton from './NewButton'
import Container from '@/components/Container/Container'
import Title from './Title'
import type { Metadata } from 'next'

type Props = { params: { tick: string } }

export const metadata: Metadata = {
  title: 'Sats | Devote',
  description: 'Projects based on Ordinals BRC20 voting.',
}

const Page = ({ params }: Props) => {
  const { tick } = params

  const renderProposalsHeader = () => {
    return (
      <div className="flex items-center justify-between mb-[1.5rem]">
        <Title />
        <NewButton tick={tick} />
      </div>
    )
  }

  return (
    <Container>
      <div className="flex gap-[2rem]">
        <div className="w-[15rem]">
          <SideCard tick={tick} />
        </div>
        <div className="flex-1">
          {renderProposalsHeader()}
          <ProposalList tick={tick} />
        </div>
      </div>
    </Container>
  )
}

export default Page
