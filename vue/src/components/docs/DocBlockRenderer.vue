<script setup lang="ts">
import { computed } from 'vue'
import DocsCodeBlock from '@/components/docs/DocsCodeBlock.vue'
import DocsCommandBlock from '@/components/docs/DocsCommandBlock.vue'
import DocsComponentsGrid from '@/components/docs/DocsComponentsGrid.vue'
import DocsInstallationTabs from '@/components/docs/DocsInstallationTabs.vue'
import DocsPropsTable from '@/components/docs/DocsPropsTable.vue'
import VueDemoCanvas from '@/components/docs/VueDemoCanvas.vue'
import { navigate, toInternalHref } from '@/router'
import type { DocBlock } from '@/lib/types'

defineOptions({
  name: 'DocBlockRenderer',
})

interface Props {
  block: DocBlock
  docId: string
}

const props = defineProps<Props>()

const headingClass = computed(() => {
  if (props.block.type !== 'heading') {
    return ''
  }

  if (props.block.level === 2) {
    return 'font-heading mt-16 scroll-m-20 border-b pb-4 text-xl font-semibold tracking-tight first:mt-0'
  }

  if (props.block.level === 3) {
    return 'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight'
  }

  return 'font-heading mt-8 scroll-m-20 text-2xl font-semibold tracking-tight'
})

const headingHref = (id: string) => toInternalHref(`/docs/${props.docId}`, { section: id })

const handleHeadingClick = (id: string) => {
  navigate(`/docs/${props.docId}`, { section: id })
}
</script>

<template>
  <component
    :is="`h${block.level}`"
    v-if="block.type === 'heading'"
    :id="block.id"
    :class="headingClass"
  >
    <a class="subheading-anchor" :href="headingHref(block.id)" aria-label="Link to section" @click.prevent="handleHeadingClick(block.id)">
      {{ block.text }}
    </a>
  </component>

  <p v-else-if="block.type === 'paragraph'" v-html="block.html" />

  <ul v-else-if="block.type === 'list' && !block.ordered">
    <li v-for="(item, index) in block.items" :key="`${block.type}-${index}`" v-html="item" />
  </ul>

  <ol v-else-if="block.type === 'list' && block.ordered" :start="block.start">
    <li v-for="(item, index) in block.items" :key="`${block.type}-${index}`" v-html="item" />
  </ol>

  <blockquote v-else-if="block.type === 'blockquote'" v-html="block.html" />

  <VueDemoCanvas
    v-else-if="block.type === 'demo'"
    :demo-path="block.demoPath"
    :demo-props="block.demoProps"
    :preview-class="block.previewClass"
    :code-html="block.codeHtml"
    :doc-id="docId"
  />

  <DocsInstallationTabs
    v-else-if="block.type === 'installation-tabs'"
    :item="block.item"
    :html="block.codeHtml"
  />

  <DocsPropsTable v-else-if="block.type === 'props-table'" :data="block.data" />

  <DocsComponentsGrid v-else-if="block.type === 'components-grid'" />

  <DocsCommandBlock v-else-if="block.type === 'command-block'" :item="block.item" :mcp="block.mcp" />

  <details v-else-if="block.type === 'details'" class="mt-4">
    <summary class="cursor-pointer font-medium">{{ block.summary }}</summary>
    <DocBlockRenderer v-for="(child, index) in block.blocks" :key="`${block.summary}-${index}`" :block="child" :doc-id="docId" />
  </details>

  <DocsCodeBlock v-else-if="block.type === 'code'" :html="block.html" />
</template>
