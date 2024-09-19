'use client'
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { NoOperation } from '@/utils'
import { storage } from '@/utils/storage'
import { Modal } from 'antd'
import Image from 'next/image'
import { Images } from '@/utils/images'
import { toastError } from './MessageContext'

export type KEY_TYPE = 'okxwallet' | 'unisat'
export const WALLET_CONFIG: Array<{ title: string; icon: any; key: KEY_TYPE }> = [
  {
    title: 'OKX Wallet',
    icon: Images.ICON.OKX_PNG,
    key: 'okxwallet',
  },
  {
    title: 'Unisat Wallet',
    icon: Images.ICON.UNISAT_PNG,
    key: 'unisat',
  },
]

const WalletContext = createContext<{
  connected: boolean
  currentWallet?: KEY_TYPE
  account?: string | null
  publicKey?: string | null
  balance: {
    confirmed: number
    unconfirmed: number
    total: number
  }
  active: () => any
  // signPsbt: (unsignedStr: string) => Promise<string>
  // pushPsbt: (signedStr: string) => Promise<any>
  signMessage: (message: string, key?: KEY_TYPE) => Promise<string>
  deActive: () => void
}>({
  connected: false,
  currentWallet: undefined,
  account: null,
  publicKey: null,
  // signPsbt: async () => '',
  // pushPsbt: async () => {},
  balance: {
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  },
  active: NoOperation,
  signMessage: async () => '',
  deActive: NoOperation,
})

export default function WalletContextProvider(props: { children?: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentWallet, setCurrentWallet] = useState<KEY_TYPE>()
  const [connected, setConnected] = useState(storage.getItem('connected') || false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [publicKey, setPublicKey] = useState('')
  const [address, setAddress] = useState(storage.getItem('currentORDAddress') || '')

  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  })
  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  })
  const [network, setNetwork] = useState('livenet')
  const self = selfRef.current
  const getBasicInfo = async () => {
    if (currentWallet === 'okxwallet') {
      const okxwallet = (window as any).okxwallet
      const [address] = await okxwallet.bitcoin.getAccounts()
      setAddress(address)
      const publicKey = await okxwallet.bitcoin.getPublicKey()
      setPublicKey(publicKey)
      const balance = await okxwallet.bitcoin.getBalance()
      setBalance(balance)
      const network = await okxwallet.bitcoin.getNetwork()
      setNetwork(network)
    } else if (currentWallet === 'unisat') {
      const unisat = (window as any).unisat
      const [address] = await unisat.getAccounts()
      setAddress(address)
      const publicKey = await unisat.getPublicKey()
      setPublicKey(publicKey)
      const balance = await unisat.getBalance()
      setBalance(balance)
      const network = await unisat.getNetwork()
      setNetwork(network)
    }
  }

  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      setConnected(true)
      // prevent from triggering twice
      return
    }
    self.accounts = _accounts
    if (_accounts.length > 0) {
      setAccounts(_accounts)
      setConnected(true)
      setAddress(_accounts[0])
      getBasicInfo()
    } else {
      setConnected(false)
    }
  }

  const handleNetworkChanged = (network: string) => {
    setNetwork(network)
    getBasicInfo()
  }
  useEffect(() => {
    if (localStorage.getItem('currentWallet') === 'okxwallet') {
      const okxwallet = (window as any)?.okxwallet
      if (!okxwallet) return
      const isConnected = storage.getItem('connected')
      if (!isConnected) return
      okxwallet.bitcoin.getAccounts().then((accounts: string[]) => {
        handleAccountsChanged(accounts)
      })
      okxwallet.bitcoin.on('accountsChanged', handleAccountsChanged)
      okxwallet.bitcoin.on('networkChanged', handleNetworkChanged)

      return () => {
        okxwallet.bitcoin.removeListener('accountsChanged', handleAccountsChanged)
        okxwallet.bitcoin.removeListener('networkChanged', handleNetworkChanged)
      }
    } else {
      const unisat = (window as any)?.unisat
      if (!unisat) return
      const isConnected = storage.getItem('connected')
      if (!isConnected) return
      unisat.getAccounts().then((accounts: string[]) => {
        handleAccountsChanged(accounts)
      })
      unisat.on('accountsChanged', handleAccountsChanged)
      unisat.on('networkChanged', handleNetworkChanged)

      return () => {
        unisat.removeListener('accountsChanged', handleAccountsChanged)
        unisat.removeListener('networkChanged', handleNetworkChanged)
      }
    }
  }, [])

  const active = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  // const signPsbt = useCallback(async (unsignedPsbt: string) => {
  //   const okxwallet = (window as any).okxwallet
  //   if (!okxwallet) return
  //   const data = await okxwallet.signPsbt(unsignedPsbt)
  //   return data
  // }, [])

  // const pushPsbt = useCallback(async (signedPsbt: string) => {
  //   const okxwallet = (window as any).okxwallet
  //   if (!okxwallet) return
  //   const data = await okxwallet.pushPsbt(signedPsbt)
  //   return data
  // }, [])

  const signMessage = useCallback(async (text: string, key?: KEY_TYPE) => {
    if (!key) return setIsModalOpen(true)
    if (key === 'okxwallet') {
      const okxwallet = (window as any).okxwallet
      if (!okxwallet) return
      const data = await okxwallet.bitcoin.signMessage(text)
      return data
    } else {
      const unisat = (window as any).unisat
      if (!unisat) return
      const data = await unisat.signMessage(text)
      return data
    }
  }, [])

  const deActive = useCallback(() => {
    setConnected(false)
    setCurrentWallet(undefined)
    localStorage.removeItem('currentWallet')
  }, [])

  const handleConnect = useCallback(async (key: KEY_TYPE) => {
    if (key === 'okxwallet') {
      setCurrentWallet('okxwallet')
      localStorage.setItem('currentWallet', 'okxwallet')
      const okxwallet = (window as any).okxwallet
      if (!okxwallet) return toastError('Please install the OKX Wallet or restart your browser')
      const result = await okxwallet.bitcoin.requestAccounts()
      handleAccountsChanged(result)
    } else {
      setCurrentWallet('unisat')
      localStorage.setItem('currentWallet', 'unisat')
      const unisat = (window as any).unisat
      if (!unisat) return toastError('Please install the Unisat Wallet or restart your browser')
      const result = await unisat.requestAccounts()
      handleAccountsChanged(result)
    }
    setIsModalOpen(false)
  }, [])

  useEffect(() => {
    if (address) {
      storage.setItem('currentORDAddress', address)
    } else {
      storage.remove('currentORDAddress')
    }
  }, [address, connected])

  useEffect(() => {
    setCurrentWallet((localStorage?.getItem('currentWallet') as KEY_TYPE) || undefined)
    storage.setItem('connected', connected)
  }, [connected])

  return (
    <WalletContext.Provider
      value={{
        connected,
        account: address,
        balance,
        active,
        // signPsbt,
        publicKey,
        // pushPsbt,
        signMessage,
        deActive,
        currentWallet,
      }}
    >
      {props.children}
      <Modal
        title={
          <h3 className="text-center text-[#202020] font-bold">{connected ? 'Switch Wallet' : 'Connect Wallet'}</h3>
        }
        open={isModalOpen}
        width={400}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
      >
        <div className="h-[7rem] pt-[.2rem]">
          {WALLET_CONFIG.map((i) => (
            <div
              key={i.key}
              onClick={() => handleConnect(i.key)}
              className="w-[21rem] h-[3rem] rounded-3xl border-[1px] border-solid border-[#E6E7EB] hover:border-[#F5BD07] flex items-center pl-[.5rem] my-[.5rem] cursor-pointer mx-auto"
            >
              <Image src={i.icon} width={32} height={32} alt="okx" className="mr-[.75rem] rounded-full" />
              <p className="font-medium text-[#202020]">{i.title}</p>
            </div>
          ))}
        </div>
      </Modal>
    </WalletContext.Provider>
  )
}

export function useUnisatWallet() {
  return useContext(WalletContext)
}
