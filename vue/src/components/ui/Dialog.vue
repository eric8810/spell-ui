<script setup lang="ts">
import { DialogRoot } from 'radix-vue'

// Dialog Root
interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
}

defineProps<DialogProps>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <DialogRoot :open="open" :default-open="defaultOpen" @update:open="emit('update:open', $event)" data-slot="dialog">
    <slot />
  </DialogRoot>
</template>