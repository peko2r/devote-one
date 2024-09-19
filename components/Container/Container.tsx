import React from 'react'

type Props = {
  children: React.ReactNode
}

const Container = ({ children }: Props) => {
  return <div className="w-[73.75rem] mx-auto">{children}</div>
}

export default Container
