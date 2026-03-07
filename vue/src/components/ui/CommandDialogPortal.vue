<script setup lang="ts">
import { DialogPortal } from 'radix-vue'

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <DialogPortal
    data-slot="command-dialog-portal"
    v-bind="$attrs"
  >
    <slot />
  </DialogPortal>
</template>
