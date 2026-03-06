<template>
  <li
    data-slot="sidebar-menu-sub-item"
    data-sidebar="menu-sub-item"
    :class="cn('group/menu-sub-item relative', $attrs.class as string)"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
