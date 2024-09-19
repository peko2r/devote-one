'use client'
import { CSSProperties, forwardRef, HTMLAttributes, MouseEvent, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useKeyPress } from 'ahooks'
import { CSSTransition } from 'react-transition-group'
import './modal.css'
import clsx from 'clsx'
import { XImage } from '@/views/common/XImage'
import { Images } from '@/utils/images'

export interface ModalProps {
  isOpen?: boolean
  style?: CSSProperties
  className?: string
  children?: any
  onClose: () => void
  maskStyle?: CSSProperties
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  closeOnBack?: boolean
  showClose?: boolean
  enableBackgroundScroll?: boolean
  noTransition?: boolean
}

export default forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & ModalProps>(function Modal(
  props: ModalProps,
  ref,
) {
  const [_isOpen, set_isOpen] = useState(false)

  useEffect(() => {
    set_isOpen(props.isOpen || false)
  }, [props.isOpen])
  return (
    <>
      {/*<GlobalStyles />*/}
      <CSSTransition in={_isOpen} timeout={props.noTransition ? 0 : 200} unmountOnExit classNames={'modal-item'}>
        <BaseModal {...props} />
      </CSSTransition>
    </>
  )
})

function BaseModal(props: ModalProps) {
  const { closeOnBackdrop, onClose, closeOnBack } = props
  const onBackDropClick = useCallback(
    (e: MouseEvent) => {
      if (closeOnBackdrop && e.currentTarget === e.target) {
        onClose()
      }
    },
    [closeOnBackdrop, onClose],
  )

  useEffect(() => {
    if (closeOnBack) {
      window.history.pushState(null, '', window.location.href)
      window.addEventListener('popstate', onClose)
      return () => {
        window.removeEventListener('popstate', onClose)
      }
    }
  }, [props.closeOnBack])

  useKeyPress('esc', () => {
    props.closeOnEscape && props.onClose()
  })
  return createPortal(
    <div
      className="w-full h-full fixed z-[99999] flex items-center justify-center left-0 top-0"
      style={props.maskStyle}
      onClick={onBackDropClick}
    >
      <div className={clsx(props.className, 'relative bg-[#fff] modalContent')} style={props.style}>
        {props.showClose && (
          <XImage
            onClick={props.onClose}
            src={Images.ICON.CLOSE_SVG}
            className={'w-4.5 h-4.5 absolute top-3 right-4 cursor-pointer z-30'}
          />
        )}
        {props.children}
      </div>
    </div>,
    document.body,
  )
}
