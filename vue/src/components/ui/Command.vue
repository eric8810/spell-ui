<script setup lang="ts">
import Autocomplete from './Autocomplete.vue'

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <Autocomplete
    v-bind="$attrs"
    :open="true"
    data-slot="command"
  >
    <slot />
  </Autocomplete>
</template>
