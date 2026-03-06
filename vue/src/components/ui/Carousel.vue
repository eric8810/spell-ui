<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  orientation?: 'horizontal' | 'vertical'
  opts?: any
  plugins?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal'
})

const emit = defineEmits<{
  'update:api': [api: any]
}>()

const [emblaRef, emblaApi] = emblaCarouselVue({
  ...props.opts,
  axis: props.orientation === 'horizontal' ? 'x' : 'y'
}, props.plugins || [])

const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const scrollPrev = () => {
  emblaApi.value?.scrollPrev()
}

const scrollNext = () => {
  emblaApi.value?.scrollNext()
}

const onSelect = (api: any) => {
  if (!api) return
  canScrollPrev.value = api.canScrollPrev()
  canScrollNext.value = api.canScrollNext()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollPrev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    scrollNext()
  }
}

watch(emblaApi, (api) => {
  if (!api) return
  emit('update:api', api as any)
  onSelect(api)
  api.on('reInit', onSelect)
  api.on('select', onSelect)
})

provide('carousel', {
  emblaRef,
  api: emblaApi,
  orientation: computed(() => props.orientation),
  scrollPrev,
  scrollNext,
  canScrollPrev,
  canScrollNext
})
</script>

<template>
  <div
    :class="cn('relative', props.class)"
    role="region"
    aria-roledescription="carousel"
    data-slot="carousel"
    @keydown.capture="handleKeyDown"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>


