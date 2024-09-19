'use client'
import React from 'react'
import { http, createConfig } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'


export const config = createConfig({
    chains: [mainnet, sepolia],
    transports: { 
    [mainnet.id]: http('https://prc20.tech'),
    [sepolia.id]: http('https://prc20.tech/favicon.ico'),
    },
  })

  const queryClient = new QueryClient()
export default function WagmiConfigProvider(props: { children?: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <ConnectKitProvider theme={'web95'}>{props.children} </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
