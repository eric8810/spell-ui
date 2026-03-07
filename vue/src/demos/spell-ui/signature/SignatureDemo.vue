<script setup lang="ts">
import { Signature } from '@/components/ui'

interface Props {
  variant?: 'default' | 'contrast'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'contrast'" class="rounded-2xl p-6">
    <Signature text="Tomm." :font-size="16" color="#0156FE" />
  </div>

  <div v-else class="flex items-center justify-center">
    <Signature class="dark:invert-100" text="Spell Studio" :font-size="16" color="#1D1D1F" />
  </div>
</template>
