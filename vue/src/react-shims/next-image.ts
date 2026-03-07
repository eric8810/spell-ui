import { createElement } from 'react'

type ImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  unoptimized?: boolean
  loading?: 'lazy' | 'eager'
}

export default function Image({ unoptimized: _unused, ...props }: ImageProps) {
  return createElement('img', props)
}
