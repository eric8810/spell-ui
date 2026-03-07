export interface DocItem {
  id: string
  title: string
  description: string
  meta?: {
    docs?: Array<{
      title: string
      url: string
    }>
  }
}

export type DocSchema = Array<{
  title: string
  items: DocItem[]
}>

export interface TocItem {
  title: string
  url: string
  depth: number
}

export interface DocPropsTableItem {
  name: string
  nameDetails?: string
  type: string
  typeDetails?: string
  default?: string
  defaultDetails?: string
}

export type DocBlock =
  | {
      type: 'heading'
      level: number
      text: string
      id: string
    }
  | {
      type: 'paragraph'
      html: string
    }
  | {
      type: 'list'
      ordered: boolean
      items: string[]
      start: number
    }
  | {
      type: 'blockquote'
      html: string
    }
  | {
      type: 'code'
      html: string
    }
  | {
      type: 'demo'
      demoPath: string
      demoProps: Record<string, unknown>
      previewClass: string
      codeHtml: string
    }
  | {
      type: 'installation-tabs'
      item: string
      codeHtml: string
    }
  | {
      type: 'props-table'
      data: DocPropsTableItem[]
    }
  | {
      type: 'components-grid'
    }
  | {
      type: 'command-block'
      item: string
      mcp: boolean
    }
  | {
      type: 'details'
      summary: string
      blocks: DocBlock[]
    }

export interface RegistryItem {
  name: string
  type: 'registry:component' | 'registry:hook' | 'registry:lib'
  title: string
  description: string
  files: Array<{
    path: string
    type: string
  }>
  dependencies?: string[]
  registryDependencies?: string[]
  meta?: {
    docs?: Array<{
      title: string
      url: string
    }>
  }
}
