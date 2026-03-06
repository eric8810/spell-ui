<template>
  <DialogClose data-slot="sheet-close" v-bind="$attrs">
    <slot />
  </DialogClose>
</template>

<script setup lang="ts">
import { DialogClose } from 'radix-vue'

defineOptions({
  inheritAttrs: false
})
</script>
