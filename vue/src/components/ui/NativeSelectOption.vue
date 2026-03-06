<template>
  <option data-slot="native-select-option" v-bind="$attrs">
    <slot />
  </option>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>
