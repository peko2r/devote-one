'use client'

import { Address, useAccount, useBalance, useConnect, useContractRead, useDisconnect, useToken } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { Button } from '@/views/common/Button'
import { formatUnits } from 'viem'
import { ABI_ERC20 } from '@/utils/abis/ERC20'
import { ConnectKitButton } from 'connectkit'
export default function Web3Demo() {
  const { address, isConnected } = useAccount()
  const { data: tokenInfo } = useToken({
    address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  })
  const { data: balance, refetch } = useContractRead({
    abi: ABI_ERC20,
    address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    functionName: 'balanceOf',
    args: [address as Address],
    enabled: !!address,
  })

  const { data: bnbInfo } = useBalance({
    address,
  })

  const { disconnect } = useDisconnect()

  return (
    <div className={'mt-10'}>
      <>
        <p>connected with {address}</p>
        {bnbInfo && (
          <p>
            {bnbInfo.symbol} balance is: {formatUnits(bnbInfo.value, bnbInfo.decimals)}
          </p>
        )}
        {!!balance && tokenInfo && (
          <>
            <p>
              {tokenInfo.symbol} balance: {formatUnits(balance, tokenInfo.decimals)}
            </p>
          </>
        )}
      </>
      <ConnectKitButton.Custom>
        {({ isConnected, show, address }) =>
          isConnected ? (
            <Button onClick={() => disconnect()}>Disconnect</Button>
          ) : (
            <Button onClick={show}>Connect wallet</Button>
          )
        }
      </ConnectKitButton.Custom>
    </div>
  )
}
