import { createElement } from 'react'
import { navigateTo, toInternalHref } from './navigation'

type LinkProps = {
  href: string
  children?: any
  target?: string
  rel?: string
  className?: string
  title?: string
  onClick?: (event: MouseEvent) => void
}

const isExternal = (href: string) =>
  /^([a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

export default function Link({ href, onClick, target, ...props }: LinkProps) {
  const resolvedHref = isExternal(href) ? href : toInternalHref(href)

  return createElement('a', {
    href: resolvedHref,
    target,
    ...props,
    onClick: (event: MouseEvent) => {
      onClick?.(event)
      if (
        event.defaultPrevented ||
        target === '_blank' ||
        isExternal(href) ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      event.preventDefault()
      navigateTo(href)
    },
  })
}
