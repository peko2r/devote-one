'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { XImage } from '@/views/common/XImage'
import Modal from '@/views/modal/Modal'
import clsx from 'clsx'
import EventEmitter from 'events'
import { Images } from '@/utils/images'

export enum DialogType {
  None,
  Success,
  Error,
  Loading,
}

type DialogOption = {
  title?: string
  desc?: string
  content?: React.ReactNode
}

const event = new EventEmitter()
export const DialogContext = createContext<{
  openDialog: (type: DialogType, option?: DialogOption) => void
  close: () => void
  none: (option?: DialogOption) => void
  success: (option?: DialogOption) => void
  error: (option?: DialogOption) => void
  loading: (option?: DialogOption) => void
}>({
  openDialog: () => {},
  close: () => {},
  none: () => {},
  success: () => {},
  error: () => {},
  loading: () => {},
})

const timeOut = 200

const IconMap: { [key in DialogType]?: string } = {
  [DialogType.Error]: Images.ICON.ERROR_LIGHT_SVG,
  [DialogType.Success]: Images.ICON.SUCCESS_SVG,
  [DialogType.Loading]: Images.COMMON.LOADING_GIF,
}

const defaultTitleMap: { [key in DialogType]: string } = {
  [DialogType.Error]: 'Error',
  [DialogType.Success]: 'Successful',
  [DialogType.Loading]: 'Loading',
  [DialogType.None]: '',
}

export default function DialogContextProvider({ children }: { children: any }) {
  const [type, setType] = useState<DialogType>(DialogType.None)
  const [title, setTitle] = useState<DialogOption['title']>('')
  const [desc, setDesc] = useState<DialogOption['desc']>('')
  const [content, setContent] = useState<React.ReactNode>('')

  const openDialog = useCallback((type: DialogType, option?: DialogOption) => {
    setTitle(option?.title || '')
    setDesc(option?.desc || '')
    setContent(option?.content || '')
    setType(type)
  }, [])

  const close = useCallback(() => {
    setType(DialogType.None)
    setTimeout(() => {
      setTitle('')
      setDesc('')
      setContent('')
    }, timeOut)
  }, [openDialog])

  const none = useCallback((option?: DialogOption) => openDialog(DialogType.None, option), [openDialog])
  const success = useCallback((option?: DialogOption) => openDialog(DialogType.Success, option), [openDialog])
  const error = useCallback((option?: DialogOption) => openDialog(DialogType.Error, option), [openDialog])
  const loading = useCallback((option?: DialogOption) => openDialog(DialogType.Loading, option), [openDialog])
  useEffect(() => {
    event.on('dialog', ({ type, option }: { type: DialogType; option?: DialogOption }) => {
      openDialog(type, option)
    })
    event.on('dialog_close', close)
    return () => {
      event.off('dialog', ({ type, option }: { type: DialogType; option?: DialogOption }) => {
        openDialog(type, option)
      })
      event.off('dialog_close', close)
    }
  }, [])
  const [_type, set_type] = useState(type)
  // 关闭弹窗时记住最后的状态
  useEffect(() => {
    if (type !== DialogType.None) {
      set_type(type)
    } else {
      const timer = setTimeout(() => {
        set_type(DialogType.None)
      }, timeOut)
      return () => {
        window.clearTimeout(timer)
      }
    }
  }, [type])
  const isOpen = type !== DialogType.None

  return (
    <DialogContext.Provider value={{ openDialog, close, none, success, error, loading }}>
      {children}
      <Modal
        className="flex items-center justify-center pt-16 w-75 h-fit pb-18 bg-gray-700 flex-col px-2"
        isOpen={isOpen}
        onClose={close}
        // showClose={_type !== DialogType.Loading}
        showClose
        closeOnEscape={_type !== DialogType.Loading}
        closeOnBackdrop={_type !== DialogType.Loading}
      >
        {IconMap[_type] && (
          <XImage
            className={clsx(`block h-25 w-25`, _type === DialogType.Loading && 'scale-75')}
            src={IconMap[_type]}
          />
        )}
        {title && (
          <div className="text-base text-white mt-11 text-center leading-4">{title || defaultTitleMap[_type]}</div>
        )}

        {desc && (
          <p
            className="text-sm mt-6 text-center w-full break-words text-[#818181] whitespace-pre-wrap toast-desc"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        )}
        {content && <>{content}</>}
      </Modal>
    </DialogContext.Provider>
  )
}

export function useDialog() {
  return useContext(DialogContext)
}

const openDialog = (type: DialogType, option?: DialogOption) => {
  event.emit('dialog', { type, option })
}
export const Dialog = {
  close: () => {
    event.emit('dialog_close')
  },
  none: () => {
    openDialog(DialogType.None)
  },
  success: (desc: string, title?: string) => {
    openDialog(DialogType.Success, { desc, title })
  },
  error: (desc: string, title?: string) => {
    openDialog(DialogType.Error, { desc, title })
  },
  loading: (desc: string, title?: string) => {
    openDialog(DialogType.Loading, { desc, title })
  },
}
