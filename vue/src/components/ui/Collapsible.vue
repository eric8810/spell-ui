<script setup lang="ts">
import { CollapsibleRoot } from 'radix-vue'

interface Props {
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <CollapsibleRoot data-slot="collapsible" v-bind="$attrs">
    <slot />
  </CollapsibleRoot>
</template>
