<script setup lang="ts">
import AutocompleteGroup from './AutocompleteGroup.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AutocompleteGroup
    data-slot="command-group"
    :class="props.class"
    v-bind="$attrs"
  >
    <slot />
  </AutocompleteGroup>
</template>
