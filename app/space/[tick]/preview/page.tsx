import Container from '@/components/Container/Container'
import Preview from '@/components/Preview/Preview'
import React from 'react'

type Props = { params: { tick: string } }

const Page = ({ params }: Props) => {
  const { tick } = params
  return (
    <Container>
      <div className="mt-[2.5rem] flex gap-[2rem]">
        <Preview tick={tick} />
      </div>
    </Container>
  )
}

export default Page
