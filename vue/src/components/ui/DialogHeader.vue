<script setup lang="ts">
import { cn } from '@/lib/utils'

interface DialogHeaderProps {
  class?: string
}

const props = defineProps<DialogHeaderProps>()
</script>

<template>
  <div
    :class="cn('flex flex-col gap-2 text-center sm:text-left', props.class)"
    data-slot="dialog-header"
  >
    <slot />
  </div>
</template>
