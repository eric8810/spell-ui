<script setup lang="ts">
import { DialogRoot } from 'radix-vue'

interface Props {
  open?: boolean
  defaultOpen?: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <DialogRoot
    :default-open="defaultOpen"
    :open="open"
    data-slot="command-dialog"
    v-bind="$attrs"
    @update:open="emit('update:open', $event)"
  >
    <slot />
  </DialogRoot>
</template>
