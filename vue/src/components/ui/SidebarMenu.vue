<template>
  <ul
    data-slot="sidebar-menu"
    data-sidebar="menu"
    :class="cn('flex w-full min-w-0 flex-col gap-1', $attrs.class as string)"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
