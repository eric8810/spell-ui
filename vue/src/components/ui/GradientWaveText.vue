<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  align?: 'left' | 'center' | 'right'
  speed?: number
  paused?: boolean
  delay?: number
  repeat?: boolean
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
  repeat: true,
  bottomOffset: 20,
  bandGap: 8,
  bandCount: 8,
  customColors: () => ['#8d6869', '#5a8ea6', '#b9c96e', '#c7c571', '#cb706f', '#7e5e5f'],
  ariaLabel: '',
})

const alignmentClass = computed(() => {
  switch (props.align) {
    case 'left':
      return 'text-left'
    case 'right':
      return 'text-right'
    default:
      return 'text-center'
  }
})

const cssVars = computed(() => ({
  '--spell-gradient-wave-speed': `${Math.max(props.speed, 0.1) * 4.5}s`,
  '--spell-gradient-wave-delay': `${props.delay}s`,
  '--spell-gradient-wave-iterations': props.repeat ? 'infinite' : '1',
  '--spell-gradient-wave-play-state': props.paused ? 'paused' : 'running',
  '--spell-gradient-wave-bottom': `${props.bottomOffset}%`,
  '--spell-gradient-wave-gap': `${props.bandGap}%`,
  '--spell-gradient-wave-band-count': String(props.bandCount),
  '--spell-gradient-wave-colors': props.customColors.join(', '),
}))
</script>

<template>
  <span
    :class="cn('spell-gradient-wave inline-block', alignmentClass, props.class)"
    :style="cssVars"
    :aria-label="props.ariaLabel || undefined"
  >
    <slot />
  </span>
</template>

<style scoped>
.spell-gradient-wave {
  --gradient-wave-base: rgb(29, 29, 31);
  background-image: radial-gradient(
    circle at 50% calc(100% - var(--spell-gradient-wave-bottom)),
    var(--gradient-wave-base) 0%,
    #8d6869 10%,
    #5a8ea6 18%,
    #b9c96e 26%,
    #c7c571 34%,
    #cb706f 42%,
    #7e5e5f 50%,
    var(--gradient-wave-base) 60%
  );
  background-size: 220% 220%;
  background-position: 0% 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation-delay: var(--spell-gradient-wave-delay);
  animation-duration: var(--spell-gradient-wave-speed);
  animation-iteration-count: var(--spell-gradient-wave-iterations);
  animation-name: spell-gradient-wave;
  animation-play-state: var(--spell-gradient-wave-play-state);
  animation-timing-function: linear;
}

:global(.dark) .spell-gradient-wave {
  --gradient-wave-base: rgb(255, 255, 255);
}

@keyframes spell-gradient-wave {
  0% {
    background-position: 0% 100%;
  }

  100% {
    background-position: 200% 100%;
  }
}
</style>
