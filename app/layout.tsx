import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NProgressBar from '@/views/common/NProgressBar'
import MessageContextProvider from '@/context/MessageContext'
import DialogContextProvider from '@/context/DialogContext'
import ModalContextProvider from '@/context/ModalContext'
import WagmiConfigProvider from '@/context/WagmiConfigProvider'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import SpaceContextProvider from '@/context/SpaceContext'
import dynamic from 'next/dynamic'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import VoteContextProvider from '@/context/VoteContext'
import { ConfigProvider } from 'antd'

const DynamicUniSatProviderWithNoSSR = dynamic(() => import('@/context/UnisatWalletContext'), {
  ssr: false,
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Devote',
  description: 'Projects based on Ordinals BRC20 voting.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* <GoogleAnalyze id={''} /> */}</head>
      <body className={inter.className}>
        <AntdRegistry>
          <MessageContextProvider>
            <WagmiConfigProvider>
              <DialogContextProvider>
                <ModalContextProvider>
                  <ConfigProvider
                    theme={{
                      token: { colorPrimary: '#F5BD07', colorIconHover: '#F5BD07', colorIcon: '#202020' },
                    }}
                  >
                    <NProgressBar />
                    <DynamicUniSatProviderWithNoSSR>
                      <SpaceContextProvider>
                        <VoteContextProvider>
                          <Header />
                          <div className="min-h-[850px] mb-[5rem]">{children}</div>
                          <Footer />
                        </VoteContextProvider>
                      </SpaceContextProvider>
                    </DynamicUniSatProviderWithNoSSR>
                  </ConfigProvider>
                </ModalContextProvider>
              </DialogContextProvider>
            </WagmiConfigProvider>
          </MessageContextProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
