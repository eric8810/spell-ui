<template>
  <ScrollAreaRoot
    :class="cn('size-full min-h-0', props.class)"
    v-bind="$attrs"
  >
    <ScrollAreaViewport
      :class="cn(
        'h-full rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-has-overflow-x:overscroll-x-contain',
        scrollFade &&
          'mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]',
        scrollbarGutter &&
          'data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5'
      )"
      data-slot="scroll-area-viewport"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar orientation="vertical" />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaCorner data-slot="scroll-area-corner" />
  </ScrollAreaRoot>
</template>

<script setup lang="ts">
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaCorner
} from 'radix-vue'
import { cn } from '@/lib/utils'
import ScrollBar from './ScrollBar.vue'

interface Props {
  class?: string
  scrollFade?: boolean
  scrollbarGutter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  scrollFade: false,
  scrollbarGutter: false
})

defineOptions({
  inheritAttrs: false
})
</script>
