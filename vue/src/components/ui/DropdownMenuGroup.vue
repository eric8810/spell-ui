<template>
  <DropdownMenuGroup data-slot="dropdown-menu-group" v-bind="$attrs">
    <slot />
  </DropdownMenuGroup>
</template>

<script setup lang="ts">
import { DropdownMenuGroup } from 'radix-vue'

defineOptions({
  inheritAttrs: false
})
</script>
