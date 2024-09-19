import { useUnisatWallet } from '@/context/UnisatWalletContext'
import Link from 'next/link'
import { Images } from '@/utils/images'
import Image from 'next/image'
import { useState } from 'react'

type MenuItem = {
  title: string
  icon: string
  activeIcon: string
  link?: string
  handleClick?: () => void
}

const ConnectedMenus = () => {
  const [active, setActive] = useState('')
  const { deActive } = useUnisatWallet()
  const handleLogout = () => {
    deActive()
  }

  const MenuItems: Array<MenuItem> = [
    // {
    //   title: 'View Profile',
    //   icon: Images.HOME.USER_SVG,
    //   activeIcon: Images.HOME.ACTIVE_USER_SVG,
    //   // link: '/address',
    //   handleClick() {
    //     console.log('View Profile')
    //   },
    // },
    // {
    //   title: 'Switch Wallet',
    //   icon: Images.HOME.SWITCH_SVG,
    //   activeIcon: Images.HOME.ACTIVE_SWITCH_SVG,
    //   link: '',
    //   handleClick() {
    //     console.log('Switch Wallet')
    //   },
    // },
    // {
    //   title: 'Email Notifications',
    //   icon: Images.HOME.EMAIL_SVG,
    //   activeIcon: Images.HOME.ACTIVE_EMAIL_SVG,
    //   link: '',
    //   handleClick() {
    //     console.log('Email Notifications')
    //   },
    // },
    {
      title: 'Log Out',
      icon: Images.HOME.LOGOUT_SVG,
      activeIcon: Images.HOME.ACTIVE_LOGOUT_SVG,
      link: '',
      handleClick() {
        handleLogout()
      },
    },
  ]
  return (
    <div className="absolute top-[3.5rem] w-[13.56rem] rounded-[.5rem] hidden group-hover:block border-solid border-[1px] border-[#E6E7EB] py-[1.12rem] px-[1.5rem] text-sm font-medium bg-[#fff] z-50">
      {MenuItems.map((item) => (
        <div key={item.title} onMouseEnter={() => setActive(item.title)} onMouseOut={() => setActive('')}>
          {item?.link ? (
            <Link
              href={item.link}
              className={`flex gap-x-[11px] pt-[.63rem] items-center ${
                item.title === active ? 'text-[#F5BD07]' : 'text-[#9F9F9F]'
              }`}
            >
              <Image src={item.title === active ? item.activeIcon : item.icon} alt="" width={18} height={18} />
              {item.title}
            </Link>
          ) : (
            <div
              className={`flex gap-x-[11px] pt-[.63rem] items-center ${
                item.title === active ? 'text-[#F5BD07]' : 'text-[#9F9F9F]'
              }`}
              onClick={() => {
                item.handleClick && item.handleClick()
              }}
            >
              <Image src={item.title === active ? item.activeIcon : item.icon} alt="" width={18} height={18} />
              {item.title}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ConnectedMenus
