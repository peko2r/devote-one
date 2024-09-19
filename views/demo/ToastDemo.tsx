'use client'

import { useState } from 'react'
import { toastError, toastSuccess } from '@/context/MessageContext'
import { Button } from '@/views/common/Button'

export function ToastDemo() {
  const [text, setText] = useState('')
  return (
    <div>
      <h2>Toast Example</h2>
      <input
        className={'border-2'}
        placeholder={'请输入需要弹出的消息'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={() => toastError(text || 'default message', 'error title')}>toast error</Button>
      <Button className={'ml-10'} onClick={() => toastSuccess(text)}>
        toast success
      </Button>
    </div>
  )
}
