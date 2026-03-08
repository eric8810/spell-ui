<script setup lang="ts">
import { animate, inView, stagger } from 'motion'
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
  resolveDynamicComponent,
  useSlots,
  watch,
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
  as?: keyof HTMLElementTagNameMap
  inView?: boolean
  once?: boolean
  letterSpacing?: string | number
  style?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  class: '',
  delay: 0,
  speedReveal: 1.5,
  speedSegment: 0.5,
  trigger: true,
  as: 'p',
  inView: false,
  once: true,
  letterSpacing: undefined,
  style: () => ({}),
})

const emit = defineEmits<{
  animationStart: []
  animationComplete: []
}>()

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const shouldRender = ref(props.trigger)

let stopInView: VoidFunction | null = null
let containerAnimation: ReturnType<typeof animate> | null = null
let itemAnimation: ReturnType<typeof animate> | null = null
let sequenceId = 0
let hasPlayed = false

const MotionTag = computed(() => resolveDynamicComponent(props.as))

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

const words = computed(() =>
  textContent.value.split(' ').map((word, wordIndex, source) => ({
    key: `word-${wordIndex}`,
    characters: Array.from(word).map((char, charIndex) => ({
      key: `char-${wordIndex}-${charIndex}`,
      content: char,
    })),
    hasTrailingSpace: wordIndex < source.length - 1,
  })),
)

const baseDuration = computed(() => 0.3 / Math.max(props.speedSegment, 0.01))
const staggerInterval = computed(() => 0.03 / Math.max(props.speedReveal, 0.1))

const letterSpacingStyle = computed<CSSProperties | undefined>(() => {
  if (props.letterSpacing === undefined) {
    return undefined
  }

  return {
    marginRight: typeof props.letterSpacing === 'number'
      ? `${props.letterSpacing}px`
      : props.letterSpacing,
  }
})

const getItems = () =>
  Array.from(rootRef.value?.querySelectorAll<HTMLElement>('[data-blur-reveal-item]') ?? [])

const stopAnimations = () => {
  if (containerAnimation) {
    containerAnimation.stop()
    containerAnimation = null
  }

  if (itemAnimation) {
    itemAnimation.stop()
    itemAnimation = null
  }
}

const applyHiddenState = (hideContainer: boolean) => {
  if (rootRef.value) {
    rootRef.value.style.opacity = hideContainer ? '0' : '1'
  }

  for (const item of getItems()) {
    item.style.opacity = '0'
    item.style.filter = 'blur(12px)'
    item.style.transform = 'translateY(10px)'
  }
}

const emitCompleteIfCurrent = (currentSequence: number) => {
  if (sequenceId === currentSequence) {
    emit('animationComplete')
  }
}

const reveal = async () => {
  const currentSequence = ++sequenceId
  stopAnimations()

  if (!props.trigger) {
    shouldRender.value = false
    return
  }

  shouldRender.value = true
  await nextTick()

  if (sequenceId !== currentSequence || !rootRef.value) {
    return
  }

  applyHiddenState(true)
  emit('animationStart')

  containerAnimation = animate(rootRef.value, { opacity: 1 })
  const items = getItems()

  if (!items.length) {
    emitCompleteIfCurrent(currentSequence)
    return
  }

  itemAnimation = animate(
    items,
    { opacity: 1, filter: 'blur(0px)', y: 0 },
    {
      duration: baseDuration.value,
      delay: stagger(staggerInterval.value, { startDelay: props.delay }),
    },
  )

  itemAnimation.then(() => {
    emitCompleteIfCurrent(currentSequence)
  })
}

const hideForViewport = async () => {
  const currentSequence = ++sequenceId
  stopAnimations()
  await nextTick()

  if (sequenceId !== currentSequence || !rootRef.value) {
    return
  }

  emit('animationStart')
  containerAnimation = animate(rootRef.value, { opacity: 0 })

  const items = getItems()
  if (!items.length) {
    emitCompleteIfCurrent(currentSequence)
    return
  }

  itemAnimation = animate(items, { opacity: 0, filter: 'blur(12px)', y: 10 })
  itemAnimation.then(() => {
    emitCompleteIfCurrent(currentSequence)
  })
}

const exitPresence = async () => {
  const currentSequence = ++sequenceId
  stopAnimations()
  await nextTick()

  if (sequenceId !== currentSequence || !rootRef.value) {
    shouldRender.value = false
    return
  }

  const items = getItems()

  if (!items.length) {
    shouldRender.value = false
    emit('animationComplete')
    return
  }

  emit('animationStart')
  itemAnimation = animate(
    items,
    { opacity: 0, filter: 'blur(12px)', y: 10 },
    { delay: stagger(staggerInterval.value, { from: 'last' }) },
  )

  itemAnimation.then(() => {
    if (sequenceId !== currentSequence) {
      return
    }

    shouldRender.value = false
    emit('animationComplete')
  })
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
        if (props.trigger) {
          void hideForViewport()
        }
      }
    },
    { amount: 0 },
  )
}

watch(
  () => props.trigger,
  async (trigger) => {
    stopInView?.()
    stopInView = null

    if (trigger) {
      shouldRender.value = true
      await nextTick()
      applyHiddenState(true)

      if (props.inView) {
        await setupViewportObserver()
      } else {
        await reveal()
      }

      return
    }

    if (shouldRender.value) {
      await exitPresence()
    } else {
      stopAnimations()
    }
  },
)

watch(
  [() => props.inView, () => props.once],
  async ([inViewEnabled]) => {
    if (!props.trigger) {
      shouldRender.value = false
      return
    }

    shouldRender.value = true
    await nextTick()
    applyHiddenState(true)

    if (!inViewEnabled) {
      hasPlayed = false
      stopInView?.()
      stopInView = null
      await reveal()
      return
    }

    await setupViewportObserver()
  },
)

watch(
  [() => props.delay, () => props.speedReveal, () => props.speedSegment, textContent],
  async () => {
    if (!props.trigger) {
      return
    }

    hasPlayed = false
    shouldRender.value = true
    await nextTick()
    applyHiddenState(true)

    if (props.inView) {
      await setupViewportObserver()
    } else {
      await reveal()
    }
  },
)

onMounted(async () => {
  if (!props.trigger) {
    shouldRender.value = false
    return
  }

  shouldRender.value = true
  await nextTick()
  applyHiddenState(true)

  if (props.inView) {
    await setupViewportObserver()
    return
  }

  await reveal()
})

onBeforeUnmount(() => {
  stopInView?.()
  stopInView = null
  stopAnimations()
})
</script>

<template>
  <component
    :is="MotionTag"
    v-if="shouldRender"
    ref="rootRef"
    :class="cn(props.class)"
    :style="props.style"
  >
    <span class="sr-only">{{ textContent }}</span>
    <span
      v-for="word in words"
      :key="word.key"
      aria-hidden="true"
      class="inline-block whitespace-nowrap"
    >
      <span
        v-for="character in word.characters"
        :key="character.key"
        data-blur-reveal-item
        class="inline-block"
        :style="letterSpacingStyle"
      >
        {{ character.content }}
      </span>
      <span
        v-if="word.hasTrailingSpace"
        data-blur-reveal-item
        class="inline-block"
      >
        &nbsp;
      </span>
    </span>
  </component>
</template>
