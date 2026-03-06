<template>
  <DropdownMenuRoot data-slot="dropdown-menu" v-bind="$attrs">
    <slot />
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import { DropdownMenuRoot } from 'radix-vue'

defineOptions({
  inheritAttrs: false
})
</script>
