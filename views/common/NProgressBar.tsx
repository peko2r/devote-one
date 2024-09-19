'use client'
import { Skeleton } from 'antd'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { Suspense } from 'react'

export default function NProgressBar() {
  return (
    <Suspense fallback={<Skeleton active />}>
      <ProgressBar height={'4px'} color={'#FF95F4'} options={{ showSpinner: false }} shallowRouting />
    </Suspense>
  )
}
