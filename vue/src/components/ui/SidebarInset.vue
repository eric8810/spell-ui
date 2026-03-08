<template>
  <main
    data-slot="sidebar-inset"
    :class="cn(
      'bg-background relative flex min-w-0 w-full flex-1 flex-col not-xl:overflow-x-auto',
      'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
      $attrs.class as string
    )"
  >
    <slot />
  </main>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
