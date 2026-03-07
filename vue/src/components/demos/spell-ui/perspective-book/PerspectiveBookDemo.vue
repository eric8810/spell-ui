<script setup lang="ts">
import { BookOpen, Cog } from 'lucide-vue-next'
import { PerspectiveBook } from '@/components/ui'

interface Props {
  variant?: 'default' | 'textured'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'textured'" class="flex flex-wrap gap-8">
    <PerspectiveBook class="h-full justify-start bg-[#4D4E41] text-yellow-300" textured>
      <div class="flex h-full flex-col justify-between">
        <div class="flex flex-col gap-4">
          <h2 class="font-semibold leading-4">
            The Art of Doing Science and Engineering
          </h2>
          <Cog class="size-5" />
        </div>
        <span class="text-sm font-medium font-serif">
          Richard<br />W. Hamming
        </span>
      </div>
    </PerspectiveBook>
  </div>

  <PerspectiveBook v-else>
    <div class="flex flex-col gap-4">
      <h1 class="font-semibold leading-5">
        Your complete platform for the Design.
      </h1>
      <BookOpen class="size-5" />
    </div>
  </PerspectiveBook>
</template>
