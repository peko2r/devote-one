import { ButtonHTMLAttributes, forwardRef, HTMLAttributes, ImgHTMLAttributes } from 'react'
import clsx from 'clsx'
import { XImage } from '@/views/common/XImage'
import { Images } from '@/utils/images'

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }>(
  (props, ref) => {
    const { loading, ...restProps } = props
    return (
      <button
        {...restProps}
        className={clsx(
          `h-9 bg-gradient-to-b rounded from-[#FF99F5] to-[#FF7171] text-sm text-[#303030] disabled:from-[#8b8b8b] disabled:to-[#8b8b8b] disabled:pointer-events-none hover:opacity-70 transition-all duration-500 px-2`,
          props.className,
          props.loading ? 'pointer-events-none flex justify-center items-center' : '',
        )}
        ref={ref}
      >
        {props.loading && <XImage src={Images.ICON.LOADING_SVG} className={'w-4 animate-spin mr-1'} />}
        {props.children}
      </button>
    )
  },
)
