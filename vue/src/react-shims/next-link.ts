import { createElement } from 'react'
import { navigateTo } from './navigation'

type LinkProps = {
  href: string
  children?: any
  target?: string
  rel?: string
  className?: string
  title?: string
  onClick?: (event: MouseEvent) => void
}

const isExternal = (href: string) => /^([a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:')

export default function Link({ href, onClick, target, ...props }: LinkProps) {
  return createElement('a', {
    href,
    target,
    ...props,
    onClick: (event: MouseEvent) => {
      onClick?.(event)
      if (event.defaultPrevented || target === '_blank' || isExternal(href)) {
        return
      }

      event.preventDefault()
      navigateTo(href)
    },
  })
}
