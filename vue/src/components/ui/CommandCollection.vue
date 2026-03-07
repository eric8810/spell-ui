<script setup lang="ts">
import AutocompleteCollection from './AutocompleteCollection.vue'

interface Props {
  class?: string
  items?: unknown[]
  getKey?: (item: unknown, index: number) => string | number
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AutocompleteCollection
    data-slot="command-collection"
    :class="props.class"
    :get-key="props.getKey"
    :items="props.items"
    v-bind="$attrs"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </AutocompleteCollection>
</template>
