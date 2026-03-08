<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { cn } from '@/lib/utils'

type Variant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'cyan'
  | 'indigo'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'sky'
  | 'slate'
  | 'fuchsia'

interface Props {
  class?: string
  variant?: Variant
  duration?: number
  delay?: number
  spread?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  duration: 1.5,
  delay: 1.5,
  spread: 50,
})

const variantMap: Record<Variant, string> = {
  default: '',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive dark:text-destructive-foreground',
  red: 'text-red-600 dark:text-red-400',
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  purple: 'text-purple-600 dark:text-purple-400',
  pink: 'text-pink-600 dark:text-pink-400',
  orange: 'text-orange-600 dark:text-orange-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  violet: 'text-violet-600 dark:text-violet-400',
  rose: 'text-rose-600 dark:text-rose-400',
  amber: 'text-amber-600 dark:text-amber-400',
  lime: 'text-lime-600 dark:text-lime-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  sky: 'text-sky-600 dark:text-sky-400',
  slate: 'text-slate-600 dark:text-slate-400',
  fuchsia: 'text-fuchsia-600 dark:text-fuchsia-400',
}

const repeatDelay = 1.5
const animationName = `spell-ui-shimmer-text-${getCurrentInstance()?.uid ?? 'default'}`

const totalDuration = computed(() => props.duration + repeatDelay)
const holdPercent = computed(() => (props.duration / totalDuration.value) * 100)

const keyframesCss = computed(() => `@keyframes ${animationName} {
  0% {
    background-position-x: -100%;
  }

  ${holdPercent.value}%,
  100% {
    background-position-x: 250%;
  }
}`)

const shimmerStyle = computed(() => ({
  WebkitTextFillColor: 'transparent',
  background:
    'currentColor linear-gradient(to right, currentColor 0%, var(--shimmer-contrast) 40%, var(--shimmer-contrast) 60%, currentColor 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '50% 200%',
  backgroundPositionX: '250%',
  animationName,
  animationDuration: `${totalDuration.value}s`,
  animationDelay: `${props.delay}s`,
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
}))
</script>

<template>
  <div class="group overflow-hidden">
    <component :is="'style'" v-text="keyframesCss" />
    <div>
      <span
        :class="
          cn(
            'inline-block [--shimmer-contrast:rgba(255,255,255,0.6)] dark:[--shimmer-contrast:rgba(0,0,0,0.5)]',
            variantMap[variant],
            props.class,
          )
        "
        :style="shimmerStyle"
      >
        <span><slot /></span>
      </span>
    </div>
  </div>
</template>
