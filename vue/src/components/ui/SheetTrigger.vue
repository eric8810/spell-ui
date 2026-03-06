<template>
  <DialogTrigger data-slot="sheet-trigger" v-bind="$attrs">
    <slot />
  </DialogTrigger>
</template>

<script setup lang="ts">
import { DialogTrigger } from 'radix-vue'

defineOptions({
  inheritAttrs: false
})
</script>
