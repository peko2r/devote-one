import AddForm from '@/components/AddForm/AddForm'
import BackBtn from '@/components/BackBtn/BackBtn'
import Container from '@/components/Container/Container'
import NewBtnGroup from '@/components/NewBtnGroup/NewBtnGroup'
import React from 'react'

const Page = () => {
  const renderLeftArea = () => {
    return (
      <div>
        <BackBtn />
        <AddForm />
      </div>
    )
  }

  return (
    <Container>
      <div className="flex justify-between w-full">
        {renderLeftArea()}
        <NewBtnGroup />
      </div>
    </Container>
  )
}

export default Page
