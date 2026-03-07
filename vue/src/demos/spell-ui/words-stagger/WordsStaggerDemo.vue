<script setup lang="ts">
import SplitTextReveal from '@/demos/shared/SplitTextReveal.vue'

interface Props {
  variant?: 'default' | 'speed' | 'stagger'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'speed'" class="flex flex-col gap-8">
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">SLOW (1)</p>
      <SplitTextReveal text="You can just ship things." split="words" class="text-xl font-medium" :stagger="0.18" :duration="1" />
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">NORMAL (0.5)</p>
      <SplitTextReveal text="You can just ship things." split="words" class="text-xl font-medium" :stagger="0.1" :duration="0.5" />
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">FAST (0.3)</p>
      <SplitTextReveal text="You can just ship things." split="words" class="text-xl font-medium" :stagger="0.06" :duration="0.3" />
    </div>
  </div>

  <div v-else-if="props.variant === 'stagger'" class="flex flex-col gap-8">
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">SMALL STAGGER (0.05s)</p>
      <SplitTextReveal text="You can just ship things." split="words" class="text-xl font-medium" :stagger="0.05" :duration="0.5" />
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">NORMAL STAGGER (0.1s)</p>
      <SplitTextReveal text="You can just ship things." split="words" class="text-xl font-medium" :stagger="0.1" :duration="0.5" />
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">LARGE STAGGER (0.2s)</p>
      <SplitTextReveal text="You can just ship things." split="words" class="text-xl font-medium" :stagger="0.2" :duration="0.5" />
    </div>
  </div>

  <div v-else class="flex items-center justify-center">
    <SplitTextReveal
      text="Spell UI is an open source collection of elegant, user friendly components that seamlessly integrate with frameworks and AI models."
      split="words"
      class="max-w-[600px] text-2xl font-[550] tracking-tight md:text-3xl"
      :stagger="0.08"
      :duration="0.5"
    />
  </div>
</template>
