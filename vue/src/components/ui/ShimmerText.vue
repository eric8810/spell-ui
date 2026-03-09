<script setup lang="ts">
import { animate } from 'motion'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const shimmerRef = ref<HTMLElement | null>(null)
let shimmerAnimation: ReturnType<typeof animate> | null = null

const stopAnimation = () => {
  if (shimmerAnimation) {
    shimmerAnimation.stop()
    shimmerAnimation = null
  }
}

const startAnimation = async () => {
  stopAnimation()
  await nextTick()

  if (!shimmerRef.value) {
    return
  }

  shimmerRef.value.style.backgroundPositionX = '250%'
  shimmerAnimation = animate(
    shimmerRef.value,
    { backgroundPositionX: ['-100%', '250%'] },
    {
      duration: props.duration,
      delay: props.delay,
      repeat: Infinity,
      repeatDelay,
      ease: 'linear',
    },
  )
}

const shimmerStyle = computed(() => ({
  WebkitTextFillColor: 'transparent',
  background:
    'currentColor linear-gradient(to right, currentColor 0%, var(--shimmer-contrast) 40%, var(--shimmer-contrast) 60%, currentColor 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '50% 200%',
  backgroundPositionX: '250%',
}))

watch(
  () => [props.duration, props.delay],
  () => {
    void startAnimation()
  },
)

onMounted(() => {
  void startAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
})
</script>

<template>
  <div class="group overflow-hidden">
    <div>
      <span
        ref="shimmerRef"
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
