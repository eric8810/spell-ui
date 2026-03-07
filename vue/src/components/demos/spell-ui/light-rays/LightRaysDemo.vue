<script setup lang="ts">
import { LightRays } from '@/components/ui'

interface Props {
  variant?: 'default' | 'multi'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div
    class="relative flex min-h-[500px] w-full items-center justify-center md:min-h-[350px]"
  >
    <LightRays
      background-color="var(--background)"
      :style="{ zIndex: 0 }"
      :rays-color="
        props.variant === 'multi'
          ? { mode: 'multi', color1: '#2060DF', color2: '#ffffff' }
          : { mode: 'single', color: '#639AFF' }
      "
    />
    <div
      :class="
        props.variant === 'multi'
          ? 'z-10 flex h-full flex-col items-center gap-2'
          : 'z-10 flex h-full gap-2 text-primary'
      "
    >
      <p class="text-4xl font-semibold tracking-tighter">
        {{ props.variant === 'multi' ? 'Multi Colored' : 'Beautiful' }}
      </p>
      <p class="text-4xl font-medium font-serif italic">Light Rays</p>
    </div>
  </div>
</template>
