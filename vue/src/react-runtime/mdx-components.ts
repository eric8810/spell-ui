import { createElement } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import * as DemoCanvasModule from '@react/components/demo-canvas'
import * as InstallationTabsModule from '@react/components/installation-tabs'
import * as PropsTableModule from '@react/components/props-table'
import * as CopyCodeButtonModule from '@react/components/copy-code-button'

type MdxComponentMap = Record<string, any>

const { DemoCanvas, DemoCode, DemoPreview } = DemoCanvasModule as any
const { InstallationTabs } = InstallationTabsModule as any
const { PropsTable } = PropsTableModule as any
const { CopyCodeButton } = CopyCodeButtonModule as any

export const useMDXComponents = (components: MdxComponentMap = {}) => ({
  ...components,
  DemoCanvas,
  DemoPreview,
  DemoCode,
  InstallationTabs,
  PropsTable,
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'> & { children?: ReactNode }) =>
    createElement(
      'h2',
      {
        className:
          'font-heading mt-16 scroll-m-20 border-b pb-4 text-xl font-semibold tracking-tight first:mt-0',
        ...props,
      },
      children,
    ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'> & { children?: ReactNode }) =>
    createElement(
      'h3',
      {
        className: 'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        ...props,
      },
      children,
    ),
  a: ({
    children,
    href,
    ...props
  }: ComponentPropsWithoutRef<'a'> & { children?: ReactNode }) =>
    createElement(
      'a',
      {
        href,
        target: href?.startsWith('http') ? '_blank' : undefined,
        ...props,
      },
      children,
    ),
  pre: ({
    children,
    className,
    style,
    ...props
  }: ComponentPropsWithoutRef<'pre'> & { children?: ReactNode }) =>
    createElement(
      'div',
      { className: 'relative', 'data-code-container': 'true' },
      createElement(
        'pre',
        {
          className: `max-h-80 overflow-x-auto font-mono border ${className ?? ''}`,
          style,
          ...props,
        },
        children,
      ),
      createElement(
        'div',
        { className: 'absolute top-2.5 right-2.5' },
        createElement(CopyCodeButton),
      ),
    ),
})
