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
  useSlots,
  watch,
  type VNodeChild,
} from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  delay?: number
  stagger?: number
  speed?: number
  autoStart?: boolean
  inView?: boolean
  once?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  delay: 0,
  stagger: 0.1,
  speed: 0.5,
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

const words = computed(() =>
  textContent.value
    .split(' ')
    .filter((word) => word.length > 0),
)

const getItems = () =>
  Array.from(rootRef.value?.querySelectorAll<HTMLElement>('[data-words-stagger-item]') ?? [])

const stopAnimation = () => {
  if (animation) {
    animation.stop()
    animation = null
  }
}

const applyHiddenState = () => {
  for (const item of getItems()) {
    item.style.opacity = '0'
    item.style.filter = 'blur(10px)'
    item.style.transform = 'translateY(10px)'
  }
}

const animateIn = async () => {
  const currentSequence = ++sequenceId
  stopAnimation()
  await nextTick()

  if (sequenceId !== currentSequence) {
    return
  }

  applyHiddenState()
  const items = getItems()

  emit('start')

  if (!items.length) {
    emit('complete')
    return
  }

  animation = animate(
    items,
    { opacity: 1, filter: 'blur(0px)', y: 0 },
    {
      type: 'tween',
      ease: 'easeOut',
      duration: props.speed,
      delay: stagger(props.stagger, { startDelay: props.delay }),
    },
  )

  animation.then(() => {
    if (sequenceId === currentSequence) {
      emit('complete')
    }
  })
}

const animateOut = async () => {
  const currentSequence = ++sequenceId
  stopAnimation()
  await nextTick()

  if (sequenceId !== currentSequence) {
    return
  }

  const items = getItems()

  if (!items.length) {
    return
  }

  animation = animate(items, { opacity: 0, filter: 'blur(10px)', y: 10 })
}

const setupViewportObserver = async () => {
  stopInView?.()
  stopInView = null

  if (!props.inView || !rootRef.value) {
    hasPlayed = false
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
        void animateOut()
      }
    },
    { amount: 0 },
  )
}

watch(
  [() => props.inView, () => props.once, () => props.autoStart],
  async ([inViewEnabled, , autoStart]) => {
    stopAnimation()
    await nextTick()
    applyHiddenState()

    if (inViewEnabled) {
      await setupViewportObserver()
      return
    }

    stopInView?.()
    stopInView = null
    hasPlayed = false

    if (autoStart) {
      await animateIn()
    }
  },
)

watch(
  () => [textContent.value, props.delay, props.stagger, props.speed],
  async () => {
    stopAnimation()
    await nextTick()
    applyHiddenState()

    if (props.inView) {
      hasPlayed = false
      await setupViewportObserver()
      return
    }

    if (props.autoStart) {
      await animateIn()
    }
  },
)

onMounted(async () => {
  await nextTick()
  applyHiddenState()

  if (props.inView) {
    await setupViewportObserver()
    return
  }

  if (props.autoStart) {
    await animateIn()
  }
})

onBeforeUnmount(() => {
  stopInView?.()
  stopInView = null
  stopAnimation()
})
</script>

<template>
  <div
    ref="rootRef"
    :class="cn('flex flex-wrap', props.class)"
    :aria-label="textContent"
  >
    <span class="sr-only">{{ textContent }}</span>
    <span
      v-for="(word, index) in words"
      :key="`${word}-${index}`"
      data-words-stagger-item
      aria-hidden="true"
      class="inline-block"
    >
      {{ word }}
      <span v-if="index < words.length - 1" class="inline-block">&nbsp;</span>
    </span>
  </div>
</template>
