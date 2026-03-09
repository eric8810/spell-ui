<script setup lang="ts">
import { animate, inView } from 'motion'
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
const randomizedDelays = ref<number[]>([])

let stopInView: VoidFunction | null = null
let animations: ReturnType<typeof animate>[] = []

const expoOutEasing = (value: number) => (value === 1 ? 1 : 1 - Math.pow(2, -10 * value))

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

const textContent = computed(() => {
  if (props.text !== undefined) {
    return props.text
  }

  const slotNodes = slots.default ? slots.default() : []
  return extractRawText(slotNodes as VNodeChild[])
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

const getItems = () =>
  Array.from(rootRef.value?.querySelectorAll<HTMLElement>('[data-randomized-text-item]') ?? [])

const stopAnimations = () => {
  for (const animation of animations) {
    animation.stop()
  }

  animations = []
}

const resetReveal = async () => {
  await nextTick()
  stopAnimations()

  for (const item of getItems()) {
    animate(item, { opacity: 0 }, { duration: 0 })
  }
}

const startReveal = async () => {
  await resetReveal()

  for (const [index, item] of getItems().entries()) {
    animations.push(
      animate(
        item,
        { opacity: [0, 1] },
        {
          duration: 1.2,
          delay: randomizedDelays.value[index] ?? props.delay,
          ease: expoOutEasing,
        },
      ),
    )
  }
}

const observeVisibility = async () => {
  stopInView?.()
  stopInView = null

  if (!props.inView) {
    return
  }

  await nextTick()

  if (!rootRef.value) {
    return
  }

  stopInView = inView(
    rootRef.value,
    () => {
      void startReveal()

      if (props.once) {
        return
      }

      return () => {
        void resetReveal()
      }
    },
    { amount: 0 },
  )
}

watch(
  [() => elements.value.length, () => props.delay, () => props.split],
  () => {
    refreshRandomizedDelays()
  },
  { immediate: true },
)

watch(
  () => [props.inView, props.once],
  async () => {
    await nextTick()
    await resetReveal()
    await observeVisibility()

    if (!props.inView) {
      void startReveal()
    }
  },
)

watch(
  () => textContent.value,
  async () => {
    refreshRandomizedDelays()
    await resetReveal()

    if (props.inView) {
      await observeVisibility()
      return
    }

    void startReveal()
  },
)

onMounted(() => {
  void resetReveal()
  void observeVisibility()

  if (!props.inView) {
    void startReveal()
  }
})

onBeforeUnmount(() => {
  stopInView?.()
  stopInView = null
  stopAnimations()
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
      v-for="element in elements"
      :key="element.key"
      data-randomized-text-item
      :class="props.split === 'words' ? 'mr-[0.25em]' : undefined"
      :style="{
        display: props.split === 'words' ? 'inline-block' : 'inline',
      }"
    >
      {{ element.content }}
    </span>
  </span>
</template>
