<script setup lang="ts">
import { animate, inView, stagger } from 'motion'
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
  watch,
  isVNode,
  type VNodeChild,
} from 'vue'
import { cn } from '@/lib/utils'

type SplitMode = 'words' | 'characters' | 'lines'
type StaggerFrom = 'first' | 'last' | 'center'

interface TransitionOptions {
  duration?: number
  delay?: number
  ease?: string | [number, number, number, number] | ((value: number) => number)
  type?: 'tween' | 'spring' | 'keyframes'
  stiffness?: number
  damping?: number
  mass?: number
  bounce?: number
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
let stopInView: VoidFunction | null = null
let animation: ReturnType<typeof animate> | null = null
let sequenceId = 0
let hasPlayed = false

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
  const slotNodes = slots.default ? slots.default() : []
  return extractRawText(slotNodes as VNodeChild[])
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

const getItems = () =>
  Array.from(rootRef.value?.querySelectorAll<HTMLElement>('[data-slide-up-item]') ?? [])

const stopAnimation = () => {
  if (animation) {
    animation.stop()
    animation = null
  }
}

const syncHiddenState = () => {
  stopAnimation()

  for (const item of getItems()) {
    item.style.transform = 'translateY(100%)'
  }
}

const createAnimationOptions = () => {
  const transitionDelay = props.transition.delay ?? 0

  return {
    ...props.transition,
    duration: props.transition.duration ?? 0.5,
    ease: props.transition.ease ?? [0.625, 0.05, 0, 1],
    delay: stagger(props.stagger, {
      from: props.from,
      startDelay: props.delay + transitionDelay,
    }),
  }
}

const animateIn = async () => {
  const currentSequence = ++sequenceId
  stopAnimation()
  await nextTick()

  if (sequenceId !== currentSequence) {
    return
  }

  syncHiddenState()
  const items = getItems()

  emit('start')

  if (!items.length) {
    emit('complete')
    return
  }

  animation = animate(
    items,
    { transform: ['translateY(100%)', 'translateY(0%)'] } as any,
    createAnimationOptions() as any,
  )

  animation.then(() => {
    if (sequenceId === currentSequence) {
      emit('complete')
    }
  })
}

const startAnimation = () => {
  void animateIn()
}

const reset = async () => {
  sequenceId += 1
  stopAnimation()
  await nextTick()
  syncHiddenState()
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
      void animateIn()

      if (props.once) {
        return
      }

      return () => {
        void reset()
      }
    },
    { amount: 0 },
  )
}

onMounted(async () => {
  await nextTick()
  syncHiddenState()
  await setupViewportObserver()

  if (props.autoStart && !props.inView) {
    startAnimation()
  }
})

watch(
  () => [props.inView, props.once, props.autoStart],
  async () => {
    await nextTick()
    syncHiddenState()
    await setupViewportObserver()

    if (!props.inView) {
      if (props.autoStart) {
        startAnimation()
      } else {
        await reset()
      }
    }
  },
)

watch(
  () => [textContent.value, props.delay, props.stagger, props.from, props.transition],
  async () => {
    await nextTick()
    syncHiddenState()

    if (props.inView) {
      hasPlayed = false
      await setupViewportObserver()
      return
    }

    if (props.autoStart) {
      startAnimation()
    }
  },
  { deep: true },
)

onBeforeUnmount(() => {
  stopInView?.()
  stopInView = null
  stopAnimation()
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
          data-slide-up-item
          class="inline-block"
        >
          {{ item.text }}
        </span>
      </span>
    </span>
  </span>
</template>
