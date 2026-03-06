<script setup lang="ts">
import { TabsRoot } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  defaultValue?: string
  modelValue?: string
  orientation?: 'horizontal' | 'vertical'
}

const props = defineProps<Props>()
</script>

<template>
  <TabsRoot
    data-slot="tabs"
    :class="cn('flex flex-col gap-2', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </TabsRoot>
</template>
