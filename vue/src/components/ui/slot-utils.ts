import { Comment, Fragment, Text, cloneVNode, isVNode, type VNode } from 'vue'

export const flattenVNodes = (nodes: VNode[] = []): VNode[] => {
  const result: VNode[] = []

  for (const node of nodes) {
    if (!isVNode(node)) {
      continue
    }

    if (node.type === Comment) {
      continue
    }

    if (node.type === Text) {
      const text = String(node.children ?? '')
      if (!text.trim()) {
        continue
      }

      result.push(node)
      continue
    }

    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenVNodes(node.children as VNode[]))
      continue
    }

    result.push(node)
  }

  return result
}

export const extractTextFromVNodes = (nodes: VNode[] = []): string =>
  nodes
    .flatMap((node) => {
      if (node.type === Text) {
        return [String(node.children ?? '')]
      }

      if (Array.isArray(node.children)) {
        return [extractTextFromVNodes(flattenVNodes(node.children as VNode[]))]
      }

      if (typeof node.children === 'string') {
        return [node.children]
      }

      return []
    })
    .join('')

export const cloneVNodeWithKey = (node: VNode, key: string | number) =>
  cloneVNode(node, { key })
