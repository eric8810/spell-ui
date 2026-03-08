<script setup lang="ts">
import { BlurReveal } from '@/components/ui'

interface Props {
  variant?: 'default' | 'speed'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <BlurReveal
    v-if="props.variant === 'default'"
    class="text-2xl font-medium tracking-[-.03em] md:text-4xl"
  >
    You can just ship things.
  </BlurReveal>

  <div v-else class="flex flex-col gap-8 *:flex-col">
    <div>
      <p class="text-sm font-mono text-muted-foreground">SLOW (0.5)</p>
      <BlurReveal class="text-2xl font-medium tracking-tight" :speed-reveal="0.5" in-view>
        You can just ship things.
      </BlurReveal>
    </div>
    <div>
      <p class="text-sm font-mono text-muted-foreground">NORMAL (1.5)</p>
      <BlurReveal class="text-2xl font-medium tracking-tight" :speed-reveal="1.5" in-view>
        You can just ship things.
      </BlurReveal>
    </div>
    <div>
      <p class="text-sm font-mono text-muted-foreground">FAST (2)</p>
      <BlurReveal class="text-2xl font-medium tracking-tight" :speed-reveal="2" in-view>
        You can just ship things.
      </BlurReveal>
    </div>
  </div>
</template>
