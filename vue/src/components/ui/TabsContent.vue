<script setup lang="ts">
import { TabsContent } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  value: string
}

const props = defineProps<Props>()
</script>

<template>
  <TabsContent
    data-slot="tabs-content"
    :value="props.value"
    :class="cn('flex-1 outline-none', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </TabsContent>
</template>
