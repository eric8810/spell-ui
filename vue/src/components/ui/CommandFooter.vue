<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div
    data-slot="command-footer"
    :class="cn(
      'z-10 flex items-center justify-between gap-3 rounded-b-[calc(var(--radius-2xl)-1px)] border-t px-5 py-3 text-muted-foreground text-xs',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
