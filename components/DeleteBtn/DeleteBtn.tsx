import React, { useEffect, useRef, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { useCreation, useHover, useRequest } from 'ahooks'
import { deleteProposal } from '@/utils/http/services'
import { useUnisatWallet } from '@/context/UnisatWalletContext'
import { Popconfirm } from 'antd'
import { toastError, toastSuccess } from '@/context/MessageContext'
import { ModalComponent, useModal } from '@/context/ModalContext'
import Modal from '@/views/modal/Modal'
import { Button } from '@/views/common/Button'
import clsx from 'clsx'
import Image from 'next/image'
import { Images } from '@/utils/images'

type Props = {
  tick: string
  id: number
  address: string
  mutate: any
  data: any
}

const DeleteBtn = ({ tick, id, address, mutate, data }: Props) => {
  const { signMessage, currentWallet } = useUnisatWallet()
  const { openModal } = useModal()
  const deleteRef = useRef(null)
  const isHover = useHover(deleteRef)
  const info = useCreation(() => data.list.filter((i: any) => i.id === id)[0], [data.list, id])
  const [sign, setSign] = useState('')

  const { run } = useRequest(deleteProposal, {
    manual: true,
    onSuccess(res) {
      if (res.message === 'Success') {
        mutate({
          list: data.list.filter((item: any) => item.id !== id),
          total: data.total - 1,
          page: data.page,
        })
        toastSuccess('Deleted successfully')
      } else {
        toastError('Delete failed')
      }
    },
    onError(err) {
      console.error(err)
      toastError('Delete failed')
    },
  })

  const handleDelete = async () => {
    const _sign = await signMessage(JSON.stringify({ address, id, tick }), currentWallet)
    setSign(_sign)
  }

  useEffect(() => {
    if (sign && sign !== '') {
      run(tick, id, address, sign)
      setSign('')
    }
  }, [sign, address, id, tick])

  const ConfirmModal: ModalComponent<boolean, { title: string; status: number }> = (props) => {
    return (
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        className={'w-[32.5rem] h-fit px-[2rem] py-[1.5rem] bg-[#FFF] rounded-[.5rem]'}
      >
        <h3 className={'text-base text-[#202020] font-bold text-center mb-[2rem]'}>Delete Your Proposal</h3>
        <div className="flex font-[.875rem] font-medium mb-[1.5rem]">
          <div className="text-[#9F9F9F] w-[12.375rem]">Proposal Name</div>
          <div className="text-[#202020] truncate flex-1 text-right">{props.title}</div>
        </div>
        <div className="flex justify-between font-[.875rem] font-medium mb-[1.5rem]">
          <div className="text-[#9F9F9F]">Current State</div>
          <div
            className={`h-[1.5rem] py-2 px-4 rounded-xl ${
              props.status === 1 ? 'bg-[#1DE3B6]' : props.status === 2 ? 'bg-[#ccc]' : 'bg-[#F141EE]'
            } text-[#fff] text-sm font-medium flex items-center justify-center`}
          >
            {props.status === 1 ? 'Active' : props.status === 2 ? 'Not started' : 'Closed'}
          </div>
        </div>
        <i className="w-[28.5rem] block h-[0.0625rem] bg-[#F0F0F0] mx-auto mb-[.56rem]" />
        <div className="text-[#9F9F9F] text-[.75rem] font-medium flex items-center gap-2">
          <Image src={Images.ICON.WARN_SVG} alt="warn" width={14} height={14} />
          Deletion is undoable. Are you sure you want to proceed?
        </div>
        <div className={'mt-5 flex justify-center items-center text-[#202020] font-medium gap-[1rem]'}>
          <div
            className="w-[9rem] h-[2.5rem] rounded-[1.25rem] border-solid border-[1px] border-[#E6E7EB] flex items-center justify-center cursor-pointer"
            onClick={() => props.resolve(false)}
          >
            Cancel
          </div>
          <div
            className="w-[9rem] h-[2.5rem] rounded-[1.25rem] bg-[#F5BD07] flex items-center justify-center cursor-pointer"
            onClick={async () => {
              props.resolve(true)
              await handleDelete()
            }}
          >
            Confirm
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <DeleteOutlined
      style={{ color: isHover ? '#ecbf42' : '#615a5d' }}
      ref={deleteRef}
      onClick={async (e) => {
        e.stopPropagation()
        await openModal(ConfirmModal, {
          title: info.title,
          status: info.status,
        })
      }}
    />
  )
}

export default DeleteBtn
