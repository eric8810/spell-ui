<script setup lang="ts">
import SplitTextReveal from '@/demos/shared/SplitTextReveal.vue'

interface Props {
  variant?: 'default' | 'speed'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <SplitTextReveal
    v-if="props.variant === 'default'"
    text="You can just ship things."
    class="text-2xl font-medium tracking-[-.03em] md:text-4xl"
    :stagger="0.02"
    :duration="0.34"
  />

  <div v-else class="flex flex-col gap-8 *:flex-col">
    <div>
      <p class="text-sm font-mono text-muted-foreground">SLOW (0.5)</p>
      <SplitTextReveal text="You can just ship things." class="text-2xl font-medium tracking-tight" :stagger="0.06" :duration="0.5" />
    </div>
    <div>
      <p class="text-sm font-mono text-muted-foreground">NORMAL (1.5)</p>
      <SplitTextReveal text="You can just ship things." class="text-2xl font-medium tracking-tight" :stagger="0.03" :duration="0.36" />
    </div>
    <div>
      <p class="text-sm font-mono text-muted-foreground">FAST (2)</p>
      <SplitTextReveal text="You can just ship things." class="text-2xl font-medium tracking-tight" :stagger="0.018" :duration="0.28" />
    </div>
  </div>
</template>
