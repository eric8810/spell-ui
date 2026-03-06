<script setup lang="ts">
import { TooltipRoot } from 'radix-vue'
import TooltipProvider from './TooltipProvider.vue'

interface Props {
  open?: boolean
  defaultOpen?: boolean
  delayDuration?: number
}

defineProps<Props>()
</script>

<template>
  <TooltipProvider>
    <TooltipRoot data-slot="tooltip" v-bind="$attrs">
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
