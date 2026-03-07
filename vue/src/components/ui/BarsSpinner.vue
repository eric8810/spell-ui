<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  size?: number
  color?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  color: 'currentColor',
  class: '',
})

const attrs = useAttrs()
const bars = Array.from({ length: 12 }, (_, index) => index)

const wrapperStyle = computed(() => ({
  '--spinner-size': `${props.size}px`,
  '--spinner-color': props.color,
}))

const getBarStyle = (index: number) => ({
  animationDelay: `${-1.2 + index * 0.1}s`,
  transform: `rotate(${index === 0 ? 0.0001 : index * 30}deg) translate(146%)`,
})
</script>

<template>
  <div
    :class="cn('spell-ui-bars-spinner-wrapper', props.class, attrs.class as string | undefined)"
    :style="wrapperStyle"
    v-bind="attrs"
  >
    <div class="spell-ui-bars-spinner">
      <div
        v-for="bar in bars"
        :key="`spinner-bar-${bar}`"
        class="spell-ui-bars-spinner-bar"
        :style="getBarStyle(bar)"
      />
    </div>
  </div>
</template>

<style scoped>
.spell-ui-bars-spinner-wrapper {
  height: var(--spinner-size, 20px);
  width: var(--spinner-size, 20px);
}

.spell-ui-bars-spinner {
  position: relative;
  top: 50%;
  left: 50%;
  height: var(--spinner-size, 20px);
  width: var(--spinner-size, 20px);
}

.spell-ui-bars-spinner-bar {
  animation: spell-ui-bars-spinner-spin 1.2s linear infinite;
  background: var(--spinner-color);
  border-radius: 6px;
  height: 8%;
  left: -10%;
  position: absolute;
  top: -3.9%;
  width: 24%;
}

@keyframes spell-ui-bars-spinner-spin {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.15;
  }
}
</style>
