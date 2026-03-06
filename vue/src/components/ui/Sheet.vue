<template>
  <DialogRoot data-slot="sheet" v-bind="$attrs">
    <slot />
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogRoot } from 'radix-vue'

defineOptions({
  inheritAttrs: false
})
</script>
