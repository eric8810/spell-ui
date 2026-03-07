<script setup lang="ts">
import { SlideUpText } from '@/components/ui'

interface Props {
  variant?: 'default' | 'stagger' | 'split'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'stagger'" class="flex flex-col gap-8">
    <div>
      <span class="mb-2 text-sm font-mono text-muted-foreground">FROM FIRST</span>
      <SlideUpText from="first" class="text-xl font-medium" in-view>
        Animation from first word
      </SlideUpText>
    </div>
    <div>
      <span class="mb-2 text-sm font-mono text-muted-foreground">FROM LAST</span>
      <SlideUpText from="last" class="text-xl font-medium" in-view>
        Animation from last word
      </SlideUpText>
    </div>
    <div>
      <span class="mb-2 text-sm font-mono text-muted-foreground">FROM CENTER</span>
      <SlideUpText from="center" class="text-xl font-medium" in-view>
        Animation from center outward
      </SlideUpText>
    </div>
  </div>

  <div v-else-if="props.variant === 'split'" class="flex flex-col gap-8">
    <div>
      <span class="mb-2 text-sm font-mono text-muted-foreground">BY WORDS</span>
      <SlideUpText split="words" class="text-xl font-medium">
        Beautiful animated text
      </SlideUpText>
    </div>
    <div>
      <span class="mb-2 text-sm font-mono text-muted-foreground">BY CHARACTERS</span>
      <SlideUpText split="characters" :stagger="0.02" class="text-xl font-medium">
        You just can ship things.
      </SlideUpText>
    </div>
    <div>
      <span class="mb-2 text-sm font-mono text-muted-foreground">BY LINES</span>
      <SlideUpText split="lines" :stagger="0.2" class="text-xl font-medium" in-view>
        First line
        {{ '\n' }}
        Second line
        {{ '\n' }}
        Third line
      </SlideUpText>
    </div>
  </div>

  <SlideUpText
    v-else
    split="words"
    class="text-2xl font-medium tracking-[-.03em] sm:text-4xl"
  >
    You can just ship things.
  </SlideUpText>
</template>
