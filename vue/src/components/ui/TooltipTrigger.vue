<script setup lang="ts">
import { TooltipTrigger } from 'radix-vue'
</script>

<template>
  <TooltipTrigger data-slot="tooltip-trigger" v-bind="$attrs">
    <slot />
  </TooltipTrigger>
</template>
