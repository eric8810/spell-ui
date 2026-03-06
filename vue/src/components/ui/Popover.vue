<script setup lang="ts">
import { PopoverRoot } from 'radix-vue'

interface Props {
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
}

defineProps<Props>()
</script>

<template>
  <PopoverRoot data-slot="popover" v-bind="$attrs">
    <slot />
  </PopoverRoot>
</template>
