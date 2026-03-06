<script setup lang="ts">
import { inject } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const carousel = inject<any>('carousel')
if (!carousel) {
  throw new Error('CarouselContent must be used within a Carousel')
}
</script>

<template>
  <div :ref="carousel.emblaRef" class="overflow-hidden" data-slot="carousel-content">
    <div
      :class="cn(
        'flex',
        carousel.orientation.value === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
        props.class
      )"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </div>
</template>
