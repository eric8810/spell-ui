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
  watch,
  type VNodeChild,
} from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  text?: string
  speed?: number
  delay?: number
  class?: string
  inView?: boolean
  once?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  speed: 20,
  delay: 0,
  class: '',
  inView: false,
  once: true,
})

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)

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

const RANDOM_CHARS = '_!X$0-+*#'
const displayText = ref('')
const started = ref(!props.inView && props.delay <= 0)
const pendingStart = ref(!props.inView && props.delay > 0)
const phase = ref<'phase1' | 'phase2'>('phase1')
const step = ref(0)

let startTimer: number | null = null
let loopTimer: number | null = null
let observer: IntersectionObserver | null = null

const randomChar = (previous?: string) => {
  let char = RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length)) || '_'
  while (char === previous) {
    char = RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length)) || '_'
  }
  return char
}

const clearTimers = () => {
  if (startTimer !== null) {
    window.clearTimeout(startTimer)
    startTimer = null
  }

  if (loopTimer !== null) {
    window.clearInterval(loopTimer)
    loopTimer = null
  }
}

const resetDisplay = (text: string) => {
  displayText.value = ' '.repeat(text.length)
  phase.value = 'phase1'
  step.value = 0
}

const runPhase1 = (text: string) => {
  const maxSteps = text.length * 2
  const currentLength = Math.min(step.value + 1, text.length)
  const chars: string[] = []

  for (let index = 0; index < currentLength; index += 1) {
    chars.push(randomChar(chars[index - 1]))
  }

  for (let index = currentLength; index < text.length; index += 1) {
    chars.push('\u00A0')
  }

  displayText.value = chars.join('')

  if (step.value < maxSteps - 1) {
    step.value += 1
    return
  }

  phase.value = 'phase2'
  step.value = 0
}

const runPhase2 = (text: string) => {
  const revealedCount = Math.floor(step.value / 2)
  const chars: string[] = []

  for (let index = 0; index < revealedCount && index < text.length; index += 1) {
    chars.push(text.charAt(index))
  }

  if (revealedCount < text.length) {
    chars.push(step.value % 2 === 0 ? '_' : randomChar())
  }

  for (let index = chars.length; index < text.length; index += 1) {
    chars.push(randomChar())
  }

  displayText.value = chars.join('')

  if (step.value < text.length * 2 - 1) {
    step.value += 1
    return
  }

  displayText.value = text
  clearTimers()
}

const startLoop = () => {
  clearTimers()
  loopTimer = window.setInterval(() => {
    const text = textContent.value

    if (phase.value === 'phase1') {
      runPhase1(text)
      return
    }

    runPhase2(text)
  }, props.speed)
}

const scheduleStart = () => {
  const text = textContent.value
  resetDisplay(text)
  clearTimers()

  if (props.delay <= 0) {
    pendingStart.value = false
    started.value = true
    startLoop()
    return
  }

  pendingStart.value = true
  startTimer = window.setTimeout(() => {
    startTimer = null
    pendingStart.value = false
    started.value = true
    startLoop()
  }, props.delay * 1000)
}

const observeVisibility = () => {
  observer?.disconnect()
  observer = null

  if (!props.inView || !rootRef.value) {
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) {
        return
      }

      if (entry.isIntersecting) {
        if (!started.value && !pendingStart.value) {
          scheduleStart()
        }

        if (props.once) {
          observer?.disconnect()
          observer = null
        }
        return
      }

      if (!props.once && !started.value) {
        pendingStart.value = false
        clearTimers()
      }
    },
    { threshold: 0, rootMargin: '-100px' },
  )

  observer.observe(rootRef.value)
}

watch(
  () => [props.inView, props.once],
  () => {
    observeVisibility()

    if (!props.inView && !started.value && !pendingStart.value) {
      scheduleStart()
    }
  },
)

watch(
  () => textContent.value,
  (text) => {
    if (!text) {
      displayText.value = ''
      return
    }

    if (started.value) {
      resetDisplay(text)
      startLoop()
      return
    }

    if (pendingStart.value) {
      scheduleStart()
    }
  },
)

onMounted(() => {
  observeVisibility()

  if (!props.inView) {
    if (started.value) {
      resetDisplay(textContent.value)
      startLoop()
      return
    }

    if (!pendingStart.value) {
      scheduleStart()
    }
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  pendingStart.value = false
  clearTimers()
})
</script>

<template>
  <span ref="rootRef" :class="cn('inline-flex h-4.5 font-mono font-medium leading-5', props.class)">
    {{ displayText }}
  </span>
</template>
