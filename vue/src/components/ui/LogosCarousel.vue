<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch, type VNode } from 'vue'
import { cn } from '@/lib/utils'
import { cloneVNodeWithKey, flattenVNodes } from './slot-utils'
import VNodeRenderer from './VNodeRenderer'

interface Props {
  stagger?: number
  count?: number
  class?: string
  duration?: number
  interval?: number
  initialDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  stagger: 0.14,
  count: undefined,
  class: '',
  duration: 600,
  interval: 2500,
  initialDelay: 500,
})

const slots = useSlots()
const index = ref(0)
const animate = ref(false)

let startTimer: number | null = null
let intervalTimer: number | null = null
let isMounted = false

type VNodeChildGroup = VNode[]

const children = computed(() => flattenVNodes((slots.default?.() ?? []) as VNode[]))
const logosPerGroup = computed(() => {
  const rawCount = props.count ?? children.value.length

  if (rawCount > 0) {
    return Math.floor(rawCount)
  }

  return Math.max(children.value.length, 1)
})

const groups = computed(() => {
  const result: VNodeChildGroup[] = []

  for (let currentIndex = 0; currentIndex < children.value.length; currentIndex += logosPerGroup.value) {
    result.push(
      children.value
        .slice(currentIndex, currentIndex + logosPerGroup.value)
        .map((child, childIndex) => cloneVNodeWithKey(child, `logos-${currentIndex}-${childIndex}`)),
    )
  }

  return result
})

const groupsLength = computed(() => groups.value.length)
const nextIndex = computed(() => {
  if (groupsLength.value <= 1) {
    return index.value
  }

  return (index.value + 1) % groupsLength.value
})

const clearTimers = () => {
  if (startTimer !== null) {
    window.clearTimeout(startTimer)
    startTimer = null
  }

  if (intervalTimer !== null) {
    window.clearInterval(intervalTimer)
    intervalTimer = null
  }
}

const scheduleAnimationStart = () => {
  if (!isMounted) {
    return
  }

  if (startTimer !== null) {
    window.clearTimeout(startTimer)
    startTimer = null
  }

  startTimer = window.setTimeout(() => {
    animate.value = true
  }, props.initialDelay)
}

const syncLoop = () => {
  if (!isMounted) {
    return
  }

  if (intervalTimer !== null) {
    window.clearInterval(intervalTimer)
    intervalTimer = null
  }

  if (!animate.value || groupsLength.value <= 1) {
    return
  }

  intervalTimer = window.setInterval(() => {
    index.value = (index.value + 1) % groupsLength.value
  }, props.interval)
}

const isCurrentGroup = (groupIndex: number) => groupIndex === index.value

const isNextGroup = (groupIndex: number) =>
  animate.value && groupsLength.value > 1 && groupIndex === nextIndex.value

const isVisibleGroup = (groupIndex: number) =>
  isCurrentGroup(groupIndex) || isNextGroup(groupIndex)

const getGroupStyle = (groupIndex: number) => {
  const visible = isVisibleGroup(groupIndex)

  return {
    gridArea: '1 / 1',
    pointerEvents: visible ? 'auto' : 'none',
    visibility: visible ? 'visible' : 'hidden',
    opacity: visible ? 1 : 0,
  } as const
}

const getLogoStyle = (groupIndex: number, logoIndex: number) => {
  const current = isCurrentGroup(groupIndex)
  const shouldAnimate = animate.value && groupsLength.value > 1 && isVisibleGroup(groupIndex)
  const state = current ? 'exit' : 'enter'

  const style = {
    animationDelay: `${logoIndex * props.stagger}s`,
    animationDuration: `${props.duration}ms`,
    animationFillMode: 'both',
  } as Record<string, string | number>

  if (!shouldAnimate) {
    return {
      ...style,
      opacity: current ? 1 : 0,
    }
  }

  return {
    ...style,
    animationName: state === 'enter' ? 'spell-ui-logos-enter' : 'spell-ui-logos-exit',
    animationTimingFunction: 'ease',
  }
}

onMounted(() => {
  isMounted = true
  scheduleAnimationStart()
  syncLoop()
})

onBeforeUnmount(() => {
  isMounted = false
  clearTimers()
})

watch(groupsLength, (value) => {
  if (value === 0) {
    index.value = 0
    animate.value = false
    clearTimers()
    return
  }

  if (index.value >= value) {
    index.value = 0
  }
})

watch(
  () => props.initialDelay,
  () => {
    scheduleAnimationStart()
  },
)

watch([animate, () => props.interval, groupsLength], () => {
  syncLoop()
})
</script>

<template>
  <div v-if="groups.length" class="grid w-full max-w-[720px] place-items-center">
    <div
      v-for="(group, groupIndex) in groups"
      :key="`group-${groupIndex}`"
      :class="cn('flex w-full justify-center gap-10', props.class)"
      :style="getGroupStyle(groupIndex)"
    >
      <div
        v-for="(logo, logoIndex) in group"
        :key="`logo-${groupIndex}-${logoIndex}`"
        :style="getLogoStyle(groupIndex, logoIndex)"
      >
        <VNodeRenderer :node="logo" :render-key="`logos-${groupIndex}-${logoIndex}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spell-ui-logos-enter {
  0% {
    transform: translateY(40px);
    filter: blur(4px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    filter: blur(0px);
    opacity: 1;
  }
}

@keyframes spell-ui-logos-exit {
  0% {
    transform: translateY(0);
    filter: blur(0px);
    opacity: 1;
  }

  100% {
    transform: translateY(-40px);
    filter: blur(4px);
    opacity: 0;
  }
}
</style>
