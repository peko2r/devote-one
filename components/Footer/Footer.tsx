'use client'
/* eslint-disable @next/next/no-img-element */
import { Images } from '@/utils/images'
import Link from 'next/link'
import './footer.css'
import Image from 'next/image'
import { useHover } from 'ahooks'
import { useRef } from 'react'
import { LinkOutlined } from '@ant-design/icons'

const Footer = () => {
  const xRef = useRef(null)
  const xIsHover = useHover(xRef)
  const docRef = useRef(null)
  const docIsHover = useHover(docRef)
  return (
    <footer className={`w-full bg-[#F5F5F5]`}>
      <div className="xl:w-[1280px] 2xl:w-[73.75rem] mx-auto">
        <div className="w-full  flex justify-between">
          <div className="pt-12 pb-8 flex flex-col">
            <a href="/">
              <img src={Images.ICON.LOGO_SVG} alt="ordinalscan" className="max-w-[100rem] w-[170.47px] h-[2.5rem]" />
            </a>
          </div>
          <Link target="_blank" href="https://twitter.com/dego_finance" ref={xRef} className="mt-12">
            <div
              className={`border-solid border-[1px] rounded-full w-10 h-10 flex items-center justify-center border-[#9f9f9f] ${
                xIsHover && 'border-[#ecbf42]'
              }`}
            >
              <LinkOutlined style={{ color: xIsHover ? '#ecbf42' : '', fontSize: 20 }} />
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
