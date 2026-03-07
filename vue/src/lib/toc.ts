import { remark } from 'remark'
import { toc } from 'mdast-util-toc'
import type { Node } from 'unist'
import type { TocItem } from './types'

interface ListNode extends Node {
  type: 'list'
  children: ListItemNode[]
}

interface ListItemNode extends Node {
  type: 'listItem'
  children: Node[]
}

interface LinkNode extends Node {
  type: 'link'
  url?: string
  children: Node[]
}

interface TextNode extends Node {
  type: 'text'
  value?: string
}

interface ParagraphNode extends Node {
  type: 'paragraph'
  children: Node[]
}

export const getTableOfContents = async (content: string): Promise<TocItem[]> => {
  const tree = remark().parse(content)
  const tocResult = toc(tree, {
    maxDepth: 3,
    tight: true,
  })

  if (!tocResult.map) {
    return []
  }

  return extractItems(tocResult.map as ListNode, 2)
}

const extractItems = (node: ListNode, depth: number): TocItem[] => {
  if (!node) {
    return []
  }

  const items: TocItem[] = []

  if (node.type === 'list' && node.children) {
    for (const child of node.children) {
      if (child.type !== 'listItem') {
        continue
      }

      const item = extractItem(child, depth)
      if (item) {
        items.push(item)
      }

      for (const nested of child.children) {
        if (nested.type === 'list') {
          items.push(...extractItems(nested as ListNode, depth + 1))
        }
      }
    }
  }

  return items
}

const extractItem = (listItem: ListItemNode, depth: number): TocItem | null => {
  let title = ''
  let url = ''

  for (const child of listItem.children) {
    if (child.type !== 'paragraph') {
      continue
    }

    const link = findLink(child as ParagraphNode)
    if (!link) {
      continue
    }

    title = extractText(link)
    url = link.url ?? ''
  }

  if (!title || !url) {
    return null
  }

  return {
    title,
    url,
    depth,
  }
}

const findLink = (node: Node): LinkNode | null => {
  if (node.type === 'link') {
    return node as LinkNode
  }

  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      const link = findLink(child)
      if (link) {
        return link
      }
    }
  }

  return null
}

const extractText = (node: Node): string => {
  if (node.type === 'text') {
    return (node as TextNode).value ?? ''
  }

  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map((child) => extractText(child)).join('')
  }

  return ''
}
