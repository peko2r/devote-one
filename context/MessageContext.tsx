'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { getErrorMsg, NoOperation } from '@/utils'
import { XImage } from '@/views/common/XImage'
import EventEmitter from 'events'
import { Images } from '@/utils/images'

interface MessageParams {
  success: (props: { title?: string; desc: string; duration: number }) => void
  error: (props: { title?: string; desc: string; duration: number }) => void
}

const MessageContext = createContext<MessageParams>({
  success: NoOperation,
  error: NoOperation
})

enum MessageType {
  Error,
  Success,
  Loading = 2,
}

interface MessageItem {
  id: number
  title?: string
  desc: string
  type: MessageType
  timer: number
  raw?: boolean
}

const DEFAULT_DURATION = 3500

let num = 0

const MAX = 5

const event = new EventEmitter()

export default function MessageContextProvider(props: { children?: any }) {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const sendFunc = useCallback((type: MessageType) => {
    return function({ title, desc, duration }: { title?: string; desc: string; duration: number }) {
      const id = num++
      const timer = window.setTimeout(() => {
        setMessages((prev) => {
          return prev.filter((x) => x.id !== id)
        })
      }, duration || DEFAULT_DURATION)
      setMessages((prev) => {
        prev.slice(MAX - 1).forEach((m) => window.clearTimeout(m.timer))
        const raw = desc.includes('</a>')
        return [{ title, desc, type, id, timer, raw }, ...prev].slice(0, MAX)
      })
    }
  }, [])

  const success = useCallback(sendFunc(MessageType.Success), [])
  const error = useCallback(sendFunc(MessageType.Error), [])
  const loading = useCallback(sendFunc(MessageType.Loading), [])

  useEffect(() => {
    const successHandler = (e: { title?: string; desc: string; duration: number }) => success(e)
    const errorHandler = (e: { title?: string; desc: any; duration: number }) => {
      let desc = e.desc || ''
      if (typeof desc === 'object') {
        desc = getErrorMsg(desc)
      }
      error({ title: e.title, desc: desc, duration: e.duration })
    }
    const loadingHandler = (e: { title?: string; desc: string; duration: number }) => loading(e)
    event.on('success', successHandler)
    event.on('error_msg', errorHandler)
    event.on('loading', loadingHandler)
    return () => {
      event.off('success', successHandler)
      event.off('error_msg', errorHandler)
      event.off('loading', loadingHandler)
    }
  }, [])

  return (
    <MessageContext.Provider value={{ success, error }}>
      {props.children}
      <MessageContent messages={messages} />
    </MessageContext.Provider>
  )
}

const iconMap: {
  [key in MessageType]: string
} = {
  [MessageType.Error]: Images.ICON.ERROR_SVG,
  [MessageType.Success]: Images.ICON.SUCCESS_SVG,
  [MessageType.Loading]: Images.ICON.LOADING_SVG
}

const defaultTitleMap: {
  [key in MessageType]: string
} = {
  [MessageType.Error]: 'Error',
  [MessageType.Success]: 'Successful',
  [MessageType.Loading]: 'Loading'
}

function MessageContent(props: { messages: MessageItem[] }) {
  return (
    <div className="fixed md:right-10 right-10 top-20 z-[999999]">
      <TransitionGroup>
        {props.messages.map((message) => (
          <CSSTransition key={message.id} timeout={300} classNames={'message'}>
            <div
              className=" w-72 h-fit mt-2 text-white text-sm px-4.5 py-3 transition-all ease-linear relative z-[99999] flex justify-start items-center border-solid border-[1px] border-[#E6E7EB] rounded-[.5rem] bg-[white]">
              <XImage className="w-8 h-8 mr-4.5" src={iconMap[message.type]} />
              <div className={'w-0 flex-grow'}>
                <h3 className={'text-base text-[#202020]'}>{message.title || defaultTitleMap[message.type]}</h3>
                {message.raw ? (
                  <p
                    className={'text-sm text-[#202020] whitespace-pre-wrap toast-desc'}
                    dangerouslySetInnerHTML={{ __html: message.desc }}
                  />
                ) : (
                  <p className={'text-sm text-[#818181]'}>{message.desc}</p>
                )}
              </div>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  )
}

export function useMessage() {
  return useContext(MessageContext)
}

export function toastSuccess(text: string, title?: string, duration?: number) {
  event.emit('success', { desc: text, title, duration })
}

export function toastError(text: any, title?: string, duration?: number) {
  console.trace({ text, title })
  event.emit('error_msg', { desc: text, title, duration })
}

export function toastLoading(text: string, title?: string, duration?: number) {
  event.emit('loading', { desc: text, title, duration })
}
