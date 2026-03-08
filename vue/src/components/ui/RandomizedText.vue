<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  isVNode,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
  type VNodeChild,
} from 'vue'
import { cn } from '@/lib/utils'

type SplitType = 'words' | 'chars'

interface Props {
  text?: string
  class?: string
  split?: SplitType
  delay?: number
  inView?: boolean
  once?: boolean
}

interface TextElement {
  content: string
  key: string
}

const props = withDefaults(defineProps<Props>(), {
  split: 'words',
  delay: 0.2,
  inView: false,
  once: true,
})

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const randomizedDelays = ref<number[]>([])

let observer: IntersectionObserver | null = null
let revealFrameId: number | null = null

const expoOutEasing =
  'linear(0, 0.5 10%, 0.75 20%, 0.875 30%, 0.9375 40%, 0.9688 50%, 0.9844 60%, 0.9922 70%, 0.9961 80%, 0.998 90%, 1)'

const extractRawText = (value: VNodeChild): string => {
  if (Array.isArray(value)) {
    return value.map((child) => extractRawText(child)).join('')
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (!isVNode(value)) {
    return ''
  }

  if (value.type === Comment) {
    return ''
  }

  if (value.type === Text) {
    return String(value.children ?? '')
  }

  if (value.type === Fragment && Array.isArray(value.children)) {
    return extractRawText(value.children as VNodeChild[])
  }

  if (Array.isArray(value.children)) {
    return extractRawText(value.children as VNodeChild[])
  }

  if (typeof value.children === 'string' || typeof value.children === 'number') {
    return String(value.children)
  }

  return ''
}

const normalizeSlotText = (value: string) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]*\n+[ \t]*/g, ' ')
    .trim()

const textContent = computed(() => {
  if (props.text !== undefined) {
    return props.text
  }

  const slotNodes = slots.default ? slots.default() : []
  return normalizeSlotText(extractRawText(slotNodes as VNodeChild[]))
})

const elements = computed<TextElement[]>(() => {
  if (props.split === 'chars') {
    return textContent.value.split('').map((char, index) => ({
      content: char === ' ' ? '\u00A0' : char,
      key: `char-${index}`,
    }))
  }

  return textContent.value.split(' ').map((word, index) => ({
    content: word,
    key: `word-${index}`,
  }))
})

const refreshRandomizedDelays = () => {
  randomizedDelays.value = elements.value.map(() => props.delay + Math.random() * 0.2 + Math.random() * 0.03)
}

const cancelRevealFrame = () => {
  if (revealFrameId !== null) {
    window.cancelAnimationFrame(revealFrameId)
    revealFrameId = null
  }
}

const resetReveal = () => {
  cancelRevealFrame()
  isVisible.value = false
}

const scheduleReveal = () => {
  cancelRevealFrame()
  revealFrameId = window.requestAnimationFrame(() => {
    isVisible.value = true
    revealFrameId = null
  })
}

const observeVisibility = () => {
  observer?.disconnect()
  observer = null

  if (!props.inView || !rootRef.value) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      if (entry.isIntersecting) {
        resetReveal()
        scheduleReveal()

        if (props.once) {
          observer?.disconnect()
          observer = null
        }
      } else if (!props.once) {
        cancelRevealFrame()
        isVisible.value = false
      }
    },
    { threshold: 0 },
  )

  observer.observe(rootRef.value)
}

watch(
  [() => elements.value.length, () => props.delay],
  () => {
    refreshRandomizedDelays()
  },
  { immediate: true },
)

watch(
  () => [props.inView, props.once],
  async () => {
    await nextTick()
    resetReveal()
    observeVisibility()

    if (!props.inView) {
      scheduleReveal()
    }
  },
)

onMounted(() => {
  observeVisibility()

  if (!props.inView) {
    scheduleReveal()
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  cancelRevealFrame()
})
</script>

<template>
  <span
    ref="rootRef"
    :class="cn(props.class)"
    :aria-label="textContent"
    :style="{ display: 'inline-block', wordBreak: 'break-word' }"
  >
    <span
      v-for="(element, index) in elements"
      :key="element.key"
      :class="props.split === 'words' ? 'mr-[0.25em]' : undefined"
      :style="{
        opacity: isVisible ? 1 : 0,
        display: props.split === 'words' ? 'inline-block' : 'inline',
        transitionProperty: 'opacity',
        transitionDuration: '1.2s',
        transitionDelay: `${randomizedDelays[index] ?? props.delay}s`,
        transitionTimingFunction: expoOutEasing,
      }"
    >
      {{ element.content }}
    </span>
  </span>
</template>
