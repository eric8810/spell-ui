<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

type From = 'left' | 'right' | 'top' | 'bottom'

interface Props {
  class?: string
  from?: From
  delay?: number
  inView?: boolean
  once?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  from: 'bottom',
  delay: 0,
  inView: false,
  once: true,
})

const rootRef = ref<HTMLElement | null>(null)
const isVisible = ref(!props.inView)
let observer: IntersectionObserver | null = null

const hiddenTransform = computed(() => {
  switch (props.from) {
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
    case 'top':
      return 'translateY(-100%)'
    case 'bottom':
    default:
      return 'translateY(100%)'
  }
})

const overlayStyle = computed(() => ({
  transform: isVisible.value ? 'translate3d(0, 0, 0)' : hiddenTransform.value,
  transitionDelay: `${props.delay}s`,
}))

onMounted(() => {
  if (!props.inView || !rootRef.value) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      if (entry.isIntersecting) {
        isVisible.value = true
        if (props.once) {
          observer?.disconnect()
          observer = null
        }
      } else if (!props.once) {
        isVisible.value = false
      }
    },
    { threshold: 0.25 },
  )

  observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <span ref="rootRef" :class="cn('relative inline-flex overflow-hidden align-baseline', props.class)">
    <span
      class="absolute inset-0 -left-[0.15em] -right-[0.18em] z-0 bg-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-white"
      :style="overlayStyle"
    />
    <span class="relative z-10 pl-[0.15em] pr-[0.18em] text-white mix-blend-difference">
      <slot />
    </span>
  </span>
</template>
