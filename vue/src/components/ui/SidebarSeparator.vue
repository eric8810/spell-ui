<template>
  <Separator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    :class="cn('bg-sidebar-border mx-2 w-auto', $attrs.class as string)"
  />
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import Separator from './Separator.vue'
</script>
