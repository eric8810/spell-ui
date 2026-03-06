<template>
  <DropdownMenuTrigger data-slot="dropdown-menu-trigger" v-bind="$attrs">
    <slot />
  </DropdownMenuTrigger>
</template>

<script setup lang="ts">
import { DropdownMenuTrigger } from 'radix-vue'

defineOptions({
  inheritAttrs: false
})
</script>
