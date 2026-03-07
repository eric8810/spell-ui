<script setup lang="ts">
import RandomizedTextReveal from '@/demos/shared/RandomizedTextReveal.vue'

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
      <RandomizedTextReveal :text="paragraph" split="chars" class="text-base font-medium tracking-tight" />
    </div>
    <div class="justif-start flex flex-col items-start gap-1">
      <span class="text-sm font-mono text-muted-foreground">BY WORDS</span>
      <RandomizedTextReveal :text="paragraph" class="text-base font-medium tracking-tight" />
    </div>
  </div>

  <div v-else class="flex min-h-[200px] items-center justify-center">
    <div class="flex max-w-2xl flex-col items-start gap-4 px-4">
      <RandomizedTextReveal text="Introducing Spell UI" split="chars" class="text-2xl font-semibold tracking-tighter md:text-3xl" />
      <RandomizedTextReveal text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi architecto soluta modi facilis fugit possimus commodi! Ipsam delectus unde repellendus." class="text-base font-[550] tracking-tight text-muted-foreground" />
    </div>
  </div>
</template>
