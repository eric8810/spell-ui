<template>
  <ScrollAreaScrollbar
    :class="cn(
      'm-1 flex opacity-0 transition-opacity delay-300 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100',
      props.class
    )"
    data-slot="scroll-area-scrollbar"
    :orientation="orientation"
    v-bind="$attrs"
  >
    <ScrollAreaThumb
      class="relative flex-1 rounded-full bg-foreground/20"
      data-slot="scroll-area-thumb"
    />
  </ScrollAreaScrollbar>
</template>

<script setup lang="ts">
import { ScrollAreaScrollbar, ScrollAreaThumb } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  orientation?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical'
})

defineOptions({
  inheritAttrs: false
})
</script>
