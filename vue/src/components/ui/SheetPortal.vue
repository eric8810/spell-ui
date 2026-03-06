<template>
  <DialogPortal data-slot="sheet-portal" v-bind="$attrs">
    <slot />
  </DialogPortal>
</template>

<script setup lang="ts">
import { DialogPortal } from 'radix-vue'

defineOptions({
  inheritAttrs: false
})
</script>
