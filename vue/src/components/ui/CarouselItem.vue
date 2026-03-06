<script setup lang="ts">
import { inject } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const carousel = inject<any>('carousel')
if (!carousel) {
  throw new Error('CarouselItem must be used within a Carousel')
}
</script>

<template>
  <div
    role="group"
    aria-roledescription="slide"
    data-slot="carousel-item"
    :class="cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      carousel.orientation.value === 'horizontal' ? 'pl-4' : 'pt-4',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
