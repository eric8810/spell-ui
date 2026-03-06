<script setup lang="ts">
interface Props {
  class?: string
}

defineProps<Props>()
</script>

<template>
  <nav aria-label="breadcrumb" data-slot="breadcrumb" v-bind="$attrs">
    <slot />
  </nav>
</template>
