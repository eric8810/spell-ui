<script setup lang="ts">
import { SearchIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import AutocompleteInput from './AutocompleteInput.vue'

interface Props {
  class?: string
  placeholder?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="py-1.5 ps-1 pe-2.5">
    <AutocompleteInput
      auto-focus
      :class="cn(
        'border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0',
        props.class
      )"
      :placeholder="props.placeholder"
      size="lg"
      start-addon
      v-bind="$attrs"
    >
      <template #startAddon>
        <SearchIcon />
      </template>
    </AutocompleteInput>
  </div>
</template>
