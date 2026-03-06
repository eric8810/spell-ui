<script setup lang="ts">
import { CollapsibleContent } from 'radix-vue'
</script>

<template>
  <CollapsibleContent data-slot="collapsible-content" v-bind="$attrs">
    <slot />
  </CollapsibleContent>
</template>
