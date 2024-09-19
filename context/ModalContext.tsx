'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ModalProps } from '@/views/modal/Modal'
import { NoOperation } from '@/utils'
import { useUpdateEffect } from 'ahooks'
import { usePathname } from 'next/navigation'

export interface OpenableProps<T> extends ModalProps {
  resolve: (param: T) => void
  reject?: (error: any) => void
}

export type ModalComponent<T, P = {}> = (props: P & OpenableProps<T>, ref?: any) => JSX.Element

type OpenModalFn = <T, P = {}>(comp: ModalComponent<T, P>, props?: P) => Promise<T>

interface ModalContextParams {
  openModal: OpenModalFn
  closeModal: () => void
}

const defaultOpenModal: OpenModalFn = () => {
  throw new Error('ModalContextProvider not found')
}

const ModalContext = createContext<ModalContextParams>({
  openModal: defaultOpenModal,
  closeModal: NoOperation,
})

interface ModalData<T> {
  id: number
  resolve: (value: T) => void
  reject: (error?: any) => void
  component: ModalComponent<T>
  props: any
  isOpen?: boolean
  timer: number | null
}

let modalId = 0
const timeout = 200

export default function ModalContextProvider(props: { children?: any }) {
  const [modals, setModals] = useState<ModalData<any>[]>([])
  const closeTargetModal = (id: number) => {
    const timer = window.setTimeout(() => setModals((prev) => prev.filter((x) => x.id !== id)), timeout)
    setModals((prev) => {
      const target = prev.find((x) => x.id === id)
      if (target) {
        target.isOpen = false
        target.timer = timer
      }
      return [...prev]
    })
  }
  const openModal: OpenModalFn = useCallback((MC, props) => {
    return new Promise(function (resolve, reject) {
      //@ts-ignore
      setModals((prev) => {
        const id = modalId++
        return [
          ...prev,
          {
            id,
            reject: (value: any) => {
              reject(value)
              closeTargetModal(id)
            },
            props: props || {},
            resolve: (value: any) => {
              resolve(value)
              closeTargetModal(id)
            },
            component: MC,
            isOpen: true,
            timer: 0,
          },
        ]
      })
    })
  }, [])
  const closeModal = useCallback(() => {
    const timer = setTimeout(() => {
      setModals(() => [])
    }, timeout)
    setModals((modals) => {
      return modals.map((modal) => Object.assign({}, modal, { isOpen: false, timer: timer }))
    })
  }, [])

  const pathname = usePathname()
  useUpdateEffect(() => {
    closeModal()
  }, [pathname])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {props.children}
      {modals.map(({ component: Component, id, reject, resolve, props, isOpen }) => {
        return (
          <Component
            isOpen={isOpen}
            key={id}
            resolve={resolve}
            reject={reject}
            onClose={() => {
              resolve(undefined)
            }}
            {...props}
          />
        )
      })}
    </ModalContext.Provider>
  )
}

export function useModal() {
  return useContext(ModalContext)
}
