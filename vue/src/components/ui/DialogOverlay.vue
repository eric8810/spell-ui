<script setup lang="ts">
import { DialogOverlay } from 'radix-vue'
import { cn } from '@/lib/utils'

interface DialogOverlayProps {
  class?: string
}

const props = defineProps<DialogOverlayProps>()
</script>

<template>
  <DialogOverlay
    :class="
      cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        props.class
      )
    "
    data-slot="dialog-overlay"
  />
</template>
