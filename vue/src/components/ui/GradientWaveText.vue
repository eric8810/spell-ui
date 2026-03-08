<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import { cn } from '@/lib/utils'

type Align = 'left' | 'center' | 'right'

const defaultColors = ['#8d6869', '#5a8ea6', '#b9c96e', '#c7c571', '#cb706f', '#7e5e5f']

interface Props {
  class?: string
  align?: Align
  speed?: number
  paused?: boolean
  delay?: number
  repeat?: boolean
  inView?: boolean
  once?: boolean
  radial?: boolean
  bottomOffset?: number
  bandGap?: number
  bandCount?: number
  customColors?: string[]
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  align: 'center',
  speed: 1,
  paused: false,
  delay: 0,
  repeat: false,
  inView: false,
  once: true,
  radial: true,
  bottomOffset: 20,
  bandGap: 4,
  bandCount: 8,
  ariaLabel: '',
})

const rootRef = ref<HTMLDivElement | null>(null)
const isInView = ref(!props.inView)

let observer: IntersectionObserver | null = null
let frameId: number | null = null
let lastFrameTimestamp = 0
let gradientIndex = -25
let cyclesDone = 0
let finished = false
let started = false
let startAt = 0
let hasPlayed = false

const cycles = computed(() => (props.repeat ? 0 : 1))

const justifyContent = computed(() => {
  switch (props.align) {
    case 'left':
      return 'flex-start'
    case 'right':
      return 'flex-end'
    default:
      return 'center'
  }
})

const resolvedColors = computed(() => (props.customColors?.length ? props.customColors : defaultColors))

const stops = computed(() => {
  const result: string[] = []
  const baseColor = 'var(--gradient-wave-base, rgb(29,29,31))'
  result.push(`${baseColor} calc((var(--gi) + 0) * 1%)`)

  for (let index = 0; index < props.bandCount && index < resolvedColors.value.length * 2; index += 1) {
    const color = resolvedColors.value[index % resolvedColors.value.length]
    const offset = (index + 2) * props.bandGap
    result.push(`${color} calc((var(--gi) + ${offset}) * 1%)`)
  }

  const endOffset = (props.bandCount + 2) * props.bandGap
  result.push(`${baseColor} calc((var(--gi) + ${endOffset}) * 1%)`)
  return result.join(', ')
})

const gradient = computed(() =>
  props.radial
    ? `radial-gradient(circle at 50% bottom, ${stops.value})`
    : `linear-gradient(0deg, ${stops.value})`,
)

const containerStyle = computed(() => ({
  justifyContent: justifyContent.value,
  '--gi': -25,
}))

const textStyle = computed<CSSProperties>(() => ({
  textAlign: props.align,
  backgroundImage: gradient.value,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  display: 'inline-block',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  WebkitBackfaceVisibility: 'hidden' as const,
  backfaceVisibility: 'hidden' as const,
  transform: 'translateZ(0)',
  paddingBottom: `${props.bottomOffset}%`,
  marginBottom: `-${props.bottomOffset}%`,
  paddingInline: '2px',
}))

const setGradientIndex = (value: number) => {
  gradientIndex = value
  rootRef.value?.style.setProperty('--gi', String(value))
}

const resetCycle = () => {
  cyclesDone = 0
  finished = false
  started = false
  lastFrameTimestamp = 0
  startAt = performance.now() + Math.max(0, props.delay) * 1000
  setGradientIndex(-25)
}

const stopAnimation = () => {
  if (frameId !== null) {
    window.cancelAnimationFrame(frameId)
    frameId = null
  }

  lastFrameTimestamp = 0
}

const animate = (timestamp: number) => {
  if (!rootRef.value || !isInView.value || finished) {
    frameId = null
    return
  }

  if (!started) {
    if (timestamp < startAt) {
      frameId = window.requestAnimationFrame(animate)
      return
    }

    started = true
    lastFrameTimestamp = timestamp
  }

  const delta = Math.min(64, timestamp - lastFrameTimestamp)
  lastFrameTimestamp = timestamp

  if (!props.paused) {
    const increment = (delta * props.speed) / 16.6667
    let next = gradientIndex + increment

    if (cycles.value === 0) {
      if (next >= 200) {
        next %= 200
      }

      setGradientIndex(next)
    } else {
      while (next >= 200 && cyclesDone < cycles.value) {
        next -= 200
        cyclesDone += 1
      }

      if (cyclesDone >= cycles.value) {
        setGradientIndex(200)
        finished = true
        frameId = null
        return
      }

      setGradientIndex(next)
    }
  }

  frameId = window.requestAnimationFrame(animate)
}

const startAnimation = () => {
  stopAnimation()

  if (!rootRef.value || !isInView.value) {
    return
  }

  lastFrameTimestamp = performance.now()
  frameId = window.requestAnimationFrame(animate)
}

const updateVisibilityObserver = () => {
  observer?.disconnect()
  observer = null

  if (!props.inView || !rootRef.value) {
    isInView.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (props.once && hasPlayed) {
            continue
          }

          isInView.value = true
          hasPlayed = true
        } else if (!props.once) {
          isInView.value = false
        }
      }
    },
    { threshold: 0.1 },
  )

  observer.observe(rootRef.value)
}

watch(
  () => isInView.value,
  (visible) => {
    stopAnimation()

    if (!visible) {
      return
    }

    resetCycle()
    startAnimation()
  },
)

watch(
  () => props.delay,
  () => {
    if (!isInView.value) {
      return
    }

    resetCycle()
    startAnimation()
  },
)

watch(
  () => [props.inView, props.once],
  () => {
    if (!props.inView) {
      hasPlayed = false
    }

    updateVisibilityObserver()
  },
)

onMounted(() => {
  setGradientIndex(-25)
  updateVisibilityObserver()

  if (isInView.value) {
    resetCycle()
    startAnimation()
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  stopAnimation()
})
</script>

<template>
  <div
    ref="rootRef"
    :class="
      cn(
        'flex h-full w-full items-center [--gradient-wave-base:rgb(29,29,31)] dark:[--gradient-wave-base:rgb(255,255,255)]',
        props.class,
      )
    "
    :style="containerStyle"
    :aria-label="props.ariaLabel || undefined"
    :role="props.ariaLabel ? 'img' : undefined"
  >
    <span :style="textStyle">
      <slot />
    </span>
  </div>
</template>
