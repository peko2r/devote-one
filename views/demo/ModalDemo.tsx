'use client'
import { ModalComponent, useModal } from '@/context/ModalContext'
import Modal from '@/views/modal/Modal'
import { Button } from '@/views/common/Button'
import clsx from 'clsx'
import { toastSuccess } from '@/context/MessageContext'

const ConfirmModal: ModalComponent<boolean, { title: string; desc: string; active?: 'confirm' | 'cancel' }> = (
  props,
) => {
  const active = props.active || 'confirm'
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} className={'w-80 h-fit rounded pt-12 px-9 pb-4'} showClose>
      <h3 className={'text-base text-whiteF3 text-center'}>{props.title}</h3>
      <p className={'mt-3 text-left text-sm text-[#818181]'}>{props.desc}</p>
      <div className={'mt-5 flex justify-center items-center'}>
        <Button
          className={clsx('mr-1 w-25', active === 'confirm' ? '' : '!from-[#7b7b7b] !to-[#7b7b7b]')}
          onClick={async () => {
            props.resolve(true)
          }}
        >
          Yes
        </Button>
        <Button
          className={clsx('w-25', active === 'cancel' ? '' : '!from-[#7b7b7b] !to-[#7b7b7b]')}
          onClick={() => props.resolve(false)}
        >
          No
        </Button>
      </div>
    </Modal>
  )
}

export function ModalDemo() {
  const { openModal } = useModal()
  return (
    <div className={'mt-10'}>
      <h2>Modal demo</h2>
      <Button
        onClick={async () => {
          const rst = await openModal(ConfirmModal, {
            title: 'test title',
            desc: '是否需要删除xxxxx',
            active: 'cancel',
          })
          if (rst) {
            toastSuccess('you selected yes ')
          } else {
            toastSuccess('You selected no')
          }
        }}
      >
        test modal
      </Button>
    </div>
  )
}
