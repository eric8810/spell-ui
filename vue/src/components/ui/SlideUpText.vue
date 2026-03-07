<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  isVNode,
  type VNodeChild,
} from 'vue'
import { cn } from '@/lib/utils'

type SplitMode = 'words' | 'characters' | 'lines'
type StaggerFrom = 'first' | 'last' | 'center'

interface TransitionOptions {
  duration?: number
  delay?: number
  ease?: string | [number, number, number, number]
}

interface Props {
  split?: SplitMode
  delay?: number
  stagger?: number
  from?: StaggerFrom
  transition?: TransitionOptions
  class?: string
  wordClass?: string
  charClass?: string
  autoStart?: boolean
  inView?: boolean
  once?: boolean
}

interface GroupItem {
  key: string
  text: string
  customIndex: number
}

interface Group {
  key: string
  items: GroupItem[]
}

const props = withDefaults(defineProps<Props>(), {
  split: 'words',
  delay: 0,
  stagger: 0.1,
  from: 'first',
  transition: () => ({
    duration: 0.5,
    ease: [0.625, 0.05, 0, 1],
  }),
  class: '',
  wordClass: '',
  charClass: '',
  autoStart: true,
  inView: false,
  once: true,
})

const emit = defineEmits<{
  start: []
  complete: []
}>()

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const isAnimating = ref(false)
const hasCompleted = ref(false)
let observer: IntersectionObserver | null = null

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

const normalizeText = (value: string) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()

const textContent = computed(() => {
  const slotNodes = slots.default ? slots.default() : []
  return normalizeText(extractRawText(slotNodes as VNodeChild[]))
})

const splitIntoCharacters = (text: string) => {
  const Segmenter = (Intl as typeof Intl & { Segmenter?: new (
    locale: string,
    options: { granularity: 'grapheme' },
  ) => { segment: (value: string) => Iterable<{ segment: string }> } }).Segmenter

  if (typeof Intl !== 'undefined' && Segmenter) {
    const segmenter = new Segmenter('en', { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }

  return Array.from(text)
}

const groups = computed<Group[]>(() => {
  const text = textContent.value

  if (!text) {
    return []
  }

  let runningIndex = 0

  if (props.split === 'characters') {
    const words = text.split(' ')

    return words.map((word, wordIndex) => {
      const characters = splitIntoCharacters(word)
      const previousCharsCount = runningIndex
      const items = characters.map((character, charIndex) => ({
        key: `character-${wordIndex}-${charIndex}`,
        text: character,
        customIndex: previousCharsCount + charIndex,
      }))

      runningIndex += characters.length

      if (wordIndex !== words.length - 1) {
        items.push({
          key: `space-${wordIndex}`,
          text: ' ',
          customIndex: previousCharsCount + characters.length,
        })
      }

      return {
        key: `group-${wordIndex}`,
        items,
      }
    })
  }

  if (props.split === 'lines') {
    return text.split('\n').map((line, index) => ({
      key: `line-${index}`,
      items: [
        {
          key: `line-item-${index}`,
          text: line,
          customIndex: runningIndex++,
        },
      ],
    }))
  }

  return text.split(' ').map((word, wordIndex, words) => {
    const items: GroupItem[] = [
      {
        key: `word-${wordIndex}`,
        text: word,
        customIndex: runningIndex,
      },
    ]

    runningIndex += 1

    if (wordIndex !== words.length - 1) {
      items.push({
        key: `space-${wordIndex}`,
        text: ' ',
        customIndex: runningIndex,
      })
    }

    return {
      key: `group-${wordIndex}`,
      items,
    }
  })
})

const totalItems = computed(() => {
  if (props.split === 'characters') {
    return groups.value.reduce((count, group) => count + group.items.length, 0)
  }

  return groups.value.length
})

const lastItemKey = computed(() => {
  const lastGroup = groups.value[groups.value.length - 1]

  if (!lastGroup) {
    return ''
  }

  const lastItem = lastGroup.items[lastGroup.items.length - 1]
  return lastItem?.key ?? ''
})

const resolveEasing = (ease: TransitionOptions['ease']) => {
  if (Array.isArray(ease) && ease.length === 4) {
    return `cubic-bezier(${ease.join(',')})`
  }

  return ease ?? 'ease'
}

const transitionDuration = computed(() => props.transition.duration ?? 0.5)
const transitionDelay = computed(() => props.transition.delay ?? 0)
const transitionEase = computed(() => resolveEasing(props.transition.ease))

const getStaggerDelay = (index: number) => {
  if (!totalItems.value) {
    return 0
  }

  if (props.from === 'last') {
    return (totalItems.value - 1 - index) * props.stagger
  }

  if (props.from === 'center') {
    const center = Math.floor(totalItems.value / 2)
    return Math.abs(center - index) * props.stagger
  }

  return index * props.stagger
}

const getItemStyle = (index: number) => ({
  transform: isAnimating.value ? 'translateY(0%)' : 'translateY(100%)',
  transitionProperty: 'transform',
  transitionDuration: `${transitionDuration.value}s`,
  transitionTimingFunction: transitionEase.value,
  transitionDelay: isAnimating.value
    ? `${props.delay + transitionDelay.value + getStaggerDelay(index)}s`
    : '0s',
})

const startAnimation = () => {
  hasCompleted.value = false
  isAnimating.value = true
  emit('start')
}

const reset = () => {
  isAnimating.value = false
  hasCompleted.value = false
}

const handleTransitionEnd = () => {
  if (!isAnimating.value || hasCompleted.value) {
    return
  }

  hasCompleted.value = true
  emit('complete')
}

const observeVisibility = () => {
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
        startAnimation()

        if (props.once) {
          observer?.disconnect()
          observer = null
        }
      }
    },
    { threshold: 0.2 },
  )

  observer.observe(rootRef.value)
}

onMounted(async () => {
  await nextTick()

  if (props.autoStart && !props.inView) {
    startAnimation()
  }

  observeVisibility()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

defineExpose({
  startAnimation,
  reset,
})
</script>

<template>
  <span
    ref="rootRef"
    :class="
      cn(
        'flex whitespace-pre-wrap',
        props.split === 'lines' ? 'flex-col' : 'flex-wrap',
        props.class,
      )
    "
  >
    <span class="sr-only">{{ textContent }}</span>

    <span
      v-for="group in groups"
      :key="group.key"
      aria-hidden="true"
      :class="cn('inline-flex overflow-hidden', props.wordClass)"
    >
      <span
        v-for="item in group.items"
        :key="item.key"
        :class="cn('relative overflow-hidden whitespace-pre-wrap', props.charClass)"
      >
        <span
          class="inline-block"
          :style="getItemStyle(item.customIndex)"
          @transitionend="item.key === lastItemKey ? handleTransitionEnd() : undefined"
        >
          {{ item.text }}
        </span>
      </span>
    </span>
  </span>
</template>
