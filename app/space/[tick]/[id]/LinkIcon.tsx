'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { Images } from '@/utils/images'
import { useHover } from 'ahooks'

type Props = {
  snapShot: number
}

const LinkIcon = ({ snapShot }: Props) => {
  const ref = useRef(null)
  const isHover = useHover(ref)

  return (
    <>
      <Image
        src={isHover ? Images.ICON.ACTIVELINK_SVG : Images.ICON.LINK_SVG}
        alt="link"
        height={12}
        width={12}
        className="cursor-pointer"
        ref={ref}
        onClick={() => window.open(`https://mempool.space/block/${snapShot}`)}
      />
    </>
  )
}

export default LinkIcon
