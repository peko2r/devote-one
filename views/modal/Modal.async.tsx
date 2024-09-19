import dynamic from 'next/dynamic'

export const AsyncModal = dynamic(() => import('./Modal'), { ssr: true })
