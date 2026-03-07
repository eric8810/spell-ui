<script setup lang="ts">
import AutocompleteGroupLabel from './AutocompleteGroupLabel.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AutocompleteGroupLabel
    data-slot="command-group-label"
    :class="props.class"
    v-bind="$attrs"
  >
    <slot />
  </AutocompleteGroupLabel>
</template>
