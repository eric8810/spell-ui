<script setup lang="ts">
import DocBlockRenderer from '@/components/docs/DocBlockRenderer.vue'
import type { DocBlock } from '@/lib/types'

interface Props {
  blocks: DocBlock[]
  docId: string
}

defineProps<Props>()
</script>

<template>
  <DocBlockRenderer v-for="(block, index) in blocks" :key="`${block.type}-${index}`" :block="block" :doc-id="docId" />
</template>
