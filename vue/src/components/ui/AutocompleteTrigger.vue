<script setup lang="ts">
import { ComboboxTrigger } from 'radix-vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <ComboboxTrigger
    :class="props.class"
    data-slot="autocomplete-trigger"
    v-bind="$attrs"
  >
    <slot />
  </ComboboxTrigger>
</template>
