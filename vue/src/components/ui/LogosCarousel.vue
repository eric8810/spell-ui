<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, type VNode } from 'vue'
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
const nextIndex = ref(1)
const animate = ref(false)

let startTimer: number | null = null
let intervalTimer: number | null = null

const children = computed(() => flattenVNodes((slots.default?.() ?? []) as VNode[]))

const groups = computed(() => {
  const logosPerGroup = props.count || children.value.length
  const result: VNodeChildGroup[] = []

  for (let currentIndex = 0; currentIndex < children.value.length; currentIndex += logosPerGroup) {
    result.push(
      children.value
        .slice(currentIndex, currentIndex + logosPerGroup)
        .map((child, childIndex) => cloneVNodeWithKey(child, `logos-${currentIndex}-${childIndex}`)),
    )
  }

  return result
})

type VNodeChildGroup = VNode[]

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

const getLogoStyle = (shouldAnimate: boolean, logoIndex: number, state: 'enter' | 'exit') => {
  const style = {
    animationDelay: `${logoIndex * props.stagger}s`,
    animationDuration: `${props.duration}ms`,
    animationFillMode: 'both',
  } as Record<string, string | number>

  if (!shouldAnimate) {
    return {
      ...style,
      opacity: state === 'enter' ? 0 : 1,
    }
  }

  return {
    ...style,
    animationName: state === 'enter' ? 'spell-ui-logos-enter' : 'spell-ui-logos-exit',
    animationTimingFunction: 'ease',
  }
}

onMounted(() => {
  startTimer = window.setTimeout(() => {
    animate.value = true

    if (groups.value.length === 0) {
      return
    }

    intervalTimer = window.setInterval(() => {
      index.value = (index.value + 1) % groups.value.length
      nextIndex.value = (index.value + 1) % groups.value.length
    }, props.interval)
  }, props.initialDelay)
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <div v-if="groups.length" class="grid w-full max-w-[720px] place-items-center">
    <div
      v-for="(group, groupIndex) in groups"
      :key="`group-${groupIndex}`"
      :class="cn('flex w-full justify-center gap-10', props.class)"
      :style="{
        gridArea: '1 / 1',
        pointerEvents: groupIndex === index || (groupIndex === nextIndex && animate) ? 'auto' : 'none',
      }"
    >
      <div
        v-for="(logo, logoIndex) in group"
        :key="`logo-${groupIndex}-${logoIndex}`"
        :style="getLogoStyle(animate && (groupIndex === index || groupIndex === nextIndex), logoIndex, groupIndex === index ? 'exit' : 'enter')"
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
