<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import {
  ComboboxRoot,
  type ComboboxRootEmits,
  type ComboboxRootProps,
} from 'radix-vue'

const props = defineProps<ComboboxRootProps>()
const emit = defineEmits<ComboboxRootEmits>()
const attrs = useAttrs()

const rootProps = computed(() => ({
  ...props,
  ...attrs,
}))

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <ComboboxRoot
    v-bind="rootProps"
    data-slot="autocomplete"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
    @update:search-term="emit('update:searchTerm', $event)"
    @update:selected-value="emit('update:selectedValue', $event)"
  >
    <slot />
  </ComboboxRoot>
</template>
