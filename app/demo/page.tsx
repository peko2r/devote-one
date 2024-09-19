import { ToastDemo } from '@/views/demo/ToastDemo'
import { DialogDemo } from '@/views/demo/DialogDemo'
import { ModalDemo } from '@/views/demo/ModalDemo'
import Web3Demo from '@/views/demo/Web3Demo'

export default function Demo() {
  return (
    <div>
      <ToastDemo />
      <DialogDemo />
      <ModalDemo />
      <Web3Demo />
    </div>
  )
}
