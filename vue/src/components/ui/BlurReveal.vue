<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  type CSSProperties,
  type VNodeChild,
} from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  text?: string
  class?: string
  delay?: number
  speedReveal?: number
  speedSegment?: number
  trigger?: boolean
  inView?: boolean
  style?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  class: '',
  delay: 0,
  speedReveal: 1.5,
  speedSegment: 0.4,
  trigger: true,
  inView: false,
  style: () => ({}),
})

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const active = ref(false)
let observer: IntersectionObserver | null = null
let startTimer: number | null = null

const extractText = (value: VNodeChild): string => {
  if (Array.isArray(value)) {
    return value.map(extractText).join('')
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
    return extractText(value.children as VNodeChild[])
  }

  if (Array.isArray(value.children)) {
    return extractText(value.children as VNodeChild[])
  }

  if (typeof value.children === 'string' || typeof value.children === 'number') {
    return String(value.children)
  }

  return ''
}

const textContent = computed(() => {
  if (props.text) {
    return props.text
  }

  const nodes = slots.default ? slots.default() : []
  return extractText(nodes as VNodeChild[]).replace(/\s+/g, ' ').trim()
})

const items = computed(() =>
  Array.from(textContent.value).map((char, index) => ({
    key: `char-${index}`,
    content: char === ' ' ? '\u00A0' : char,
  })),
)

const duration = computed(() =>
  props.speedSegment > 0
    ? props.speedSegment
    : Math.max(0.24, 0.25 / Math.max(props.speedReveal, 0.1) + 0.15),
)

const stagger = computed(() => Math.max(0.015, 0.03 / Math.max(props.speedReveal, 0.1)))

const getItemStyle = (index: number) => ({
  transitionDelay: `${props.delay + index * stagger.value}s`,
  transitionDuration: `${duration.value}s`,
})

const clearStartTimer = () => {
  if (startTimer !== null) {
    window.clearTimeout(startTimer)
    startTimer = null
  }
}

const start = () => {
  clearStartTimer()
  if (!props.trigger) {
    active.value = false
    return
  }

  startTimer = window.setTimeout(() => {
    active.value = true
  }, props.delay * 1000)
}

onMounted(() => {
  if (props.inView && rootRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          start()
          observer?.disconnect()
          observer = null
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(rootRef.value)
    return
  }

  start()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearStartTimer()
})
</script>

<template>
  <span
    ref="rootRef"
    :class="cn('inline-flex flex-wrap', props.class)"
    :style="props.style"
    :aria-label="textContent"
  >
    <span class="sr-only">{{ textContent }}</span>
    <span
      v-for="(item, index) in items"
      :key="item.key"
      aria-hidden="true"
      class="inline-block will-change-transform transition-[opacity,filter,transform] ease-out"
      :style="[
        getItemStyle(index),
        active
          ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }
          : { opacity: 0, filter: 'blur(12px)', transform: 'translateY(10px)' },
      ]"
    >
      {{ item.content }}
    </span>
  </span>
</template>
