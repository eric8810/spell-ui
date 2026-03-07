import registryData from '@root/registry.json'
import type { DocItem, DocSchema, RegistryItem } from './types'

const basicDoc: DocSchema = [
  {
    title: 'Getting Started',
    items: [
      {
        title: 'Introduction',
        id: 'introduction',
        description:
          'Build elegant React interfaces with premium, copy-ready Tailwind CSS components.',
      },
      {
        title: 'Components',
        id: 'components',
        description: 'Browse all available components in Spell UI.',
      },
      {
        title: 'MCP',
        id: 'mcp',
        description: 'Integrating MCP with Spell UI lets you control it via AI.',
      },
    ],
  },
]

const transformRegistryItemToDocItem = (item: RegistryItem): DocItem => ({
  id: item.name,
  title: item.title,
  description: item.description,
  meta: item.meta,
})

const registryItems = (registryData.items as RegistryItem[]).filter(
  (item) => item.type === 'registry:component',
)

export const getDocSchema = (): DocSchema => [
  ...basicDoc,
  {
    title: 'Components',
    items: registryItems.map(transformRegistryItemToDocItem),
  },
]

export const allDocItems = () => getDocSchema().flatMap((section) => section.items)

export const getDocById = (id: string) => allDocItems().find((item) => item.id === id) ?? null
