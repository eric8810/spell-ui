<template>
  <li
    data-slot="sidebar-menu-item"
    data-sidebar="menu-item"
    :class="cn('group/menu-item relative', $attrs.class as string)"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
