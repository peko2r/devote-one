'use client'
import { Images } from '@/utils/images'
import { Marked } from '@ts-stack/markdown'
import React, { useState } from 'react'
import Image from 'next/image'

type Props = {
  description: string
}

const DescView = ({ description }: Props) => {
  const [isFull, setIsFull] = useState(false)
  return (
    <>
      {description.length > 1399 ? (
        <>
          <div
            className={`w-full show-region markdownStyle prose break-words ${
              !isFull && 'max-h-[20rem] overflow-y-hidden'
            } max-w-[51.75rem]`}
            dangerouslySetInnerHTML={{
              __html: Marked.parse(description),
            }}
          />
          <div
            className="w-[11.25rem] h-[2.5rem] rounded-[1.25rem] bg-[#F5BD07] mx-auto flex justify-center items-center gap-2 cursor-pointer mt-[1.5rem] hover:bg-[#f3d87b]"
            onClick={() => setIsFull(!isFull)}
          >
            {isFull ? 'View Less' : 'View More'}
            {isFull ? (
              <Image src={Images.ICON.TOP_SVG} alt="less" width={8} height={8} />
            ) : (
              <Image src={Images.ICON.DOWN_SVG} alt="more" width={8} height={8} />
            )}
          </div>
        </>
      ) : (
        <div
          className="w-[51.75rem] break-words show-region markdownStyle prose max-w-[51.75rem]"
          dangerouslySetInnerHTML={{
            __html: Marked.parse(description),
          }}
        />
      )}
    </>
  )
}

export default DescView
