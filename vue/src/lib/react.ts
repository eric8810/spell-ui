import { createElement, type ComponentType } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MDXProvider } from '@mdx-js/react'
import { useMDXComponents } from '@/react-runtime/mdx-components'

type ReactComponentModule = {
  default?: ComponentType<any>
}

export const mountReactComponent = (
  element: HTMLElement,
  component: ComponentType<any>,
  props: Record<string, unknown> = {},
  mode: 'react' | 'mdx' = 'react',
) => {
  const root: Root = createRoot(element)

  const child = createElement(component, props)
  const tree =
    mode === 'mdx'
      ? createElement(MDXProvider, { components: useMDXComponents() }, child)
      : child

  root.render(tree)
  return root
}

export const resolveReactComponent = (module: ReactComponentModule | ComponentType<any>) =>
  typeof module === 'function' ? module : module.default ?? null
