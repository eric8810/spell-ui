<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface LogoItem {
  src: string
  alt: string
}

interface Props {
  logos: LogoItem[]
  count?: number
  stagger?: number
  duration?: number
  interval?: number
  initialDelay?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  count: undefined,
  stagger: 0.14,
  duration: 600,
  interval: 2500,
  initialDelay: 500,
  class: '',
})

const currentIndex = ref(0)
const nextIndex = ref(1)
const animate = ref(false)

let startTimer: number | null = null
let loopTimer: number | null = null

const groups = computed(() => {
  const logosPerGroup = props.count ?? props.logos.length
  const result: LogoItem[][] = []

  for (let index = 0; index < props.logos.length; index += logosPerGroup) {
    result.push(props.logos.slice(index, index + logosPerGroup))
  }

  return result
})

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

onMounted(() => {
  startTimer = window.setTimeout(() => {
    animate.value = true

    if (groups.value.length <= 1) {
      return
    }

    loopTimer = window.setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % groups.value.length
      nextIndex.value = (currentIndex.value + 1) % groups.value.length
    }, props.interval)
  }, props.initialDelay)
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <div class="grid w-full max-w-[720px] place-items-center">
    <div
      v-for="(group, groupIndex) in groups"
      :key="`group-${groupIndex}`"
      :class="cn('flex w-full justify-center gap-10', props.class)"
      :style="{ gridArea: '1 / 1', pointerEvents: groupIndex === currentIndex || (groupIndex === nextIndex && animate) ? 'auto' : 'none' }"
    >
      <div
        v-for="(logo, logoIndex) in group"
        :key="logo.src"
        :style="{
          animationName: animate ? groupIndex === currentIndex ? 'spell-logos-exit' : 'spell-logos-enter' : undefined,
          animationDuration: `${props.duration}ms`,
          animationDelay: `${logoIndex * props.stagger}s`,
          animationFillMode: 'both',
          animationTimingFunction: 'ease',
          opacity: animate ? undefined : groupIndex === currentIndex ? 1 : 0,
        }"
      >
        <img
          :src="logo.src"
          :alt="logo.alt"
          width="96"
          height="96"
          class="pointer-events-none h-24 w-24 select-none object-contain opacity-70 not-dark:invert-100"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spell-logos-enter {
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

@keyframes spell-logos-exit {
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
