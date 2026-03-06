<script setup lang="ts">
import { CollapsibleTrigger } from 'radix-vue'
</script>

<template>
  <CollapsibleTrigger data-slot="collapsible-trigger" v-bind="$attrs">
    <slot />
  </CollapsibleTrigger>
</template>
