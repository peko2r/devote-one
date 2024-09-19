'use client'
import { forwardRef, ImgHTMLAttributes } from 'react'

export const XImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>((props, ref) => (
  <img alt={''} {...props} ref={ref} />
))
