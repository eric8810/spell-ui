<script setup lang="ts">
import { DialogTitle } from 'radix-vue'
import { cn } from '@/lib/utils'

interface DialogTitleProps {
  class?: string
}

const props = defineProps<DialogTitleProps>()
</script>

<template>
  <DialogTitle
    :class="cn('text-lg leading-none font-semibold', props.class)"
    data-slot="dialog-title"
  >
    <slot />
  </DialogTitle>
</template>
