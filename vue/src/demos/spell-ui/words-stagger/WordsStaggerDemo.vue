<script setup lang="ts">
import { WordsStagger } from '@/components/ui'

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
      <WordsStagger :speed="1" class="text-xl font-medium" in-view>
        You can just ship things.
      </WordsStagger>
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">NORMAL (0.5)</p>
      <WordsStagger :speed="0.5" class="text-xl font-medium" in-view>
        You can just ship things.
      </WordsStagger>
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">FAST (0.3)</p>
      <WordsStagger :speed="0.3" class="text-xl font-medium" in-view>
        You can just ship things.
      </WordsStagger>
    </div>
  </div>

  <div v-else-if="props.variant === 'stagger'" class="flex flex-col gap-8">
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">SMALL STAGGER (0.05s)</p>
      <WordsStagger :stagger="0.05" class="text-xl font-medium" in-view>
        You can just ship things.
      </WordsStagger>
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">NORMAL STAGGER (0.1s)</p>
      <WordsStagger :stagger="0.1" class="text-xl font-medium" in-view>
        You can just ship things.
      </WordsStagger>
    </div>
    <div class="space-y-2">
      <p class="text-sm font-mono text-muted-foreground">LARGE STAGGER (0.2s)</p>
      <WordsStagger :stagger="0.2" class="text-xl font-medium" in-view>
        You can just ship things.
      </WordsStagger>
    </div>
  </div>

  <div v-else class="flex items-center justify-center">
    <WordsStagger
      class="max-w-[600px] text-2xl font-[550] tracking-tight md:text-3xl"
    >
      Spell UI is an open source collection of elegant, user friendly
      components that seamlessly integrate with frameworks and AI models.
    </WordsStagger>
  </div>
</template>
