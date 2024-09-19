'use client'

import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { useEffect } from 'react'
import { ENV } from '@/utils/env'
import { getEllipsisStr } from '@/utils/format'
import ConnectedMenus from '../ConnectedMenus/ConnectedMenus'
import Image from 'next/image'
import { Images } from '@/utils/images'

export default function ConnectButton() {
  const { account, active, connected } = useUnisatWallet()

  useEffect(() => {
    const getUserInfoOrCreate = async () => {
      const response = await fetch(`${ENV.backend}/users/${account}`)
      await response.json()
    }

    if (connected) getUserInfoOrCreate()
  }, [connected])

  const handleConnect = () => {
    active()
  }
  return (
    <div className="w-[12.375rem] h-[5rem] group flex items-center group">
      <div
        className={`relative cursor-pointer select-none rounded-[1.5rem] flex w-full h-[3rem] items-center justify-center bg-[#fff] text-[#202020] font-medium border-solid border-[1px] border-[#E6E7EB] group-hover:border-[#F5BD07]`}
      >
        {account && connected ? (
          <div className="flex items-center cursor-pointer gap-2">
            <Image
              src={Images.HOME.DEFAULT_USER_PNG}
              alt="user-avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
            <div>{getEllipsisStr(account)}</div>
          </div>
        ) : (
          <span className=" whitespace-nowrap" onClick={handleConnect}>
            Connect Wallet
          </span>
        )}
        {account && connected && <ConnectedMenus />}
      </div>
    </div>
  )
}
