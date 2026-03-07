<script setup lang="ts">
import { RandomizedText } from '@/components/ui'

interface Props {
  variant?: 'default' | 'split'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const paragraph = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis debitis ipsam saepe incidunt laboriosam eaque quasi commodi beatae excepturi quos!'
</script>

<template>
  <div v-if="props.variant === 'split'" class="flex min-h-[200px] w-[500px] flex-col items-center justify-start gap-4">
    <div class="justif-start flex flex-col items-start gap-1">
      <span class="text-sm font-mono text-muted-foreground">BY CHARACTERS</span>
      <RandomizedText split="chars" class="text-base font-medium tracking-tight" in-view>
        {{ paragraph }}
      </RandomizedText>
    </div>
    <div class="justif-start flex flex-col items-start gap-1">
      <span class="text-sm font-mono text-muted-foreground">BY WORDS</span>
      <RandomizedText class="text-base font-medium tracking-tight" in-view>
        {{ paragraph }}
      </RandomizedText>
    </div>
  </div>

  <div v-else class="flex min-h-[200px] items-center justify-center">
    <div class="flex max-w-2xl flex-col items-start gap-4 px-4">
      <RandomizedText split="chars" class="text-2xl font-semibold tracking-tighter md:text-3xl">
        Introducing Spell UI
      </RandomizedText>
      <RandomizedText class="text-base font-[550] tracking-tight text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi architecto soluta modi facilis fugit possimus commodi! Ipsam delectus unde repellendus.
      </RandomizedText>
    </div>
  </div>
</template>
