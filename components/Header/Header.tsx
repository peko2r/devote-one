import { Images } from '@/utils/images'
import Image from 'next/image'
import React from 'react'
import ConnectButton from '../ConnectButton/ConnectButton'
import Link from 'next/link'

const Header = () => {
  return (
    <div className="border-b-[1px] border-[#E6E7EB] mb-[1.5rem] sticky top-0 z-50 bg-[#fff]">
      <div className="xl:w-[1280px] 2xl:w-[1440px] flex justify-between mx-auto">
        <Link href="/" className="flex items-center">
          <Image src={Images.ICON.LOGO_SVG} alt="Devote One" width={170.47} height={40} />
        </Link>
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header
