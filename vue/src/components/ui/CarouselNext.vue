<script setup lang="ts">
import { inject } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import Button from './Button.vue'

interface Props {
  class?: string
  variant?: any
  size?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
  size: 'icon'
})

const carousel = inject<any>('carousel')
if (!carousel) {
  throw new Error('CarouselNext must be used within a Carousel')
}
</script>

<template>
  <Button
    data-slot="carousel-next"
    :variant="props.variant"
    :size="props.size"
    :class="cn(
      'absolute size-8 rounded-full',
      carousel.orientation.value === 'horizontal'
        ? 'top-1/2 -right-12 -translate-y-1/2'
        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class
    )"
    :disabled="!carousel.canScrollNext.value"
    @click="carousel.scrollNext"
    v-bind="$attrs"
  >
    <ArrowRight />
    <span class="sr-only">Next slide</span>
  </Button>
</template>
