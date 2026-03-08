<script setup lang="ts">
import { animate, inView } from 'motion'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const overlayRef = ref<HTMLElement | null>(null)

let stopInView: VoidFunction | null = null
let animation: ReturnType<typeof animate> | null = null
let hasPlayed = false

const hiddenTarget = computed(() =>
  props.from === 'left'
    ? { x: '-100%' }
    : props.from === 'right'
      ? { x: '100%' }
      : props.from === 'top'
        ? { y: '-100%' }
        : { y: '100%' },
)

const visibleTarget = computed(() => (
  props.from === 'left' || props.from === 'right'
    ? { x: '0%' }
    : { y: '0%' }
))

const stopAnimation = () => {
  if (animation) {
    animation.stop()
    animation = null
  }
}

const applyState = async (state: 'hidden' | 'visible') => {
  await nextTick()

  if (!overlayRef.value) {
    return
  }

  stopAnimation()
  animation = animate(
    overlayRef.value,
    state === 'visible' ? visibleTarget.value : hiddenTarget.value,
    {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: state === 'visible' ? props.delay : 0,
    },
  )
}

const syncHiddenState = () => {
  stopAnimation()

  if (!overlayRef.value) {
    return
  }

  if (props.from === 'left') {
    overlayRef.value.style.transform = 'translate3d(-100%, 0, 0)'
    return
  }

  if (props.from === 'right') {
    overlayRef.value.style.transform = 'translate3d(100%, 0, 0)'
    return
  }

  if (props.from === 'top') {
    overlayRef.value.style.transform = 'translate3d(0, -100%, 0)'
    return
  }

  overlayRef.value.style.transform = 'translate3d(0, 100%, 0)'
}

const reveal = async () => {
  syncHiddenState()
  await applyState('visible')
}

const hide = async () => {
  await applyState('hidden')
}

const setupViewportObserver = async () => {
  stopInView?.()
  stopInView = null

  if (!props.inView) {
    hasPlayed = false
    return
  }

  await nextTick()

  if (!rootRef.value) {
    return
  }

  stopInView = inView(
    rootRef.value,
    () => {
      if (props.once && hasPlayed) {
        return
      }

      hasPlayed = true
      void reveal()

      if (props.once) {
        return
      }

      return () => {
        void hide()
      }
    },
    { amount: 0 },
  )
}

watch(
  () => [props.from, props.delay, props.inView, props.once],
  async () => {
    syncHiddenState()

    if (props.inView) {
      await setupViewportObserver()
      return
    }

    await reveal()
  },
)

onMounted(async () => {
  syncHiddenState()

  if (props.inView) {
    await setupViewportObserver()
    return
  }

  await reveal()
})

onBeforeUnmount(() => {
  stopInView?.()
  stopInView = null
  stopAnimation()
})
</script>

<template>
  <span ref="rootRef" :class="cn('relative inline-flex overflow-hidden align-baseline', props.class)">
    <span
      ref="overlayRef"
      class="absolute inset-0 -left-[0.15em] -right-[0.18em] z-0 bg-black will-change-transform dark:bg-white"
    />
    <span class="relative z-10 pl-[0.15em] pr-[0.18em] text-white mix-blend-difference">
      <slot />
    </span>
  </span>
</template>
