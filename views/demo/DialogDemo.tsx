'use client'

import { Dialog } from '@/context/DialogContext'
import { Button } from '@/views/common/Button'

export function DialogDemo() {
  return (
    <div className={'mt-10'}>
      <h2>Dialog Demo</h2>
      <div className={'flex justify-start gap-x-5'}>
        <Button
          onClick={() => {
            Dialog.loading('数据加载中')
          }}
        >
          dialog loading
        </Button>
        <Button
          onClick={() => {
            Dialog.success('数据加载成功')
          }}
        >
          dialog success
        </Button>
        <Button
          onClick={() => {
            Dialog.error('数据加载失败')
          }}
        >
          dialog error
        </Button>
        <Button
          onClick={() => {
            Dialog.close()
          }}
        >
          close all Dialog
        </Button>
      </div>
    </div>
  )
}
