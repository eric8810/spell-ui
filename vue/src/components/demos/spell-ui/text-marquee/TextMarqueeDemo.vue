<script setup lang="ts">
import { TextMarquee } from '@/components/ui'

interface Props {
  variant?: 'default' | 'speed'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const fruits = ['Tomato', 'Apple', 'Carrot', 'Lettuce', 'Onion']
const names = ['emily', 'dennis', 'max', 'michele', 'adgv', 'tomm', 'hugh', 'alex']
</script>

<template>
  <div v-if="props.variant === 'speed'" class="flex gap-8">
    <div class="space-y-2">
      <p class="text-sm text-muted-foreground">Speed: 0.5</p>
      <TextMarquee :speed="0.5">
        <p v-for="fruit in fruits" :key="`slow-${fruit}`" class="text-xl font-medium">
          {{ fruit }}
        </p>
      </TextMarquee>
    </div>

    <div class="space-y-2">
      <p class="text-sm text-muted-foreground">Speed: 1</p>
      <TextMarquee :speed="1">
        <p v-for="fruit in fruits" :key="`normal-${fruit}`" class="text-xl font-medium">
          {{ fruit }}
        </p>
      </TextMarquee>
    </div>

    <div class="space-y-2">
      <p class="text-sm text-muted-foreground">Speed: 2</p>
      <TextMarquee :speed="2">
        <p v-for="fruit in fruits" :key="`fast-${fruit}`" class="text-xl font-medium">
          {{ fruit }}
        </p>
      </TextMarquee>
    </div>
  </div>

  <TextMarquee v-else :height="250" :speed="1">
    <template #prefix>
      <span class="text-3xl font-medium text-muted-foreground/75">
        spell.sh/
      </span>
    </template>

    <p v-for="name in names" :key="name" class="text-3xl font-medium">
      {{ name }}
    </p>
  </TextMarquee>
</template>
