<script setup lang="ts">
import { cn } from '@/lib/utils'

interface DialogFooterProps {
  class?: string
}

const props = defineProps<DialogFooterProps>()
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        props.class
      )
    "
    data-slot="dialog-footer"
  >
    <slot />
  </div>
</template>
