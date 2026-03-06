<script setup lang="ts">
import { PopoverTrigger } from 'radix-vue'
</script>

<template>
  <PopoverTrigger data-slot="popover-trigger" v-bind="$attrs">
    <slot />
  </PopoverTrigger>
</template>
