<script setup lang="ts">
import { TabsRoot } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  defaultValue?: string
  modelValue?: string
  orientation?: 'horizontal' | 'vertical'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <TabsRoot
    data-slot="tabs"
    :class="cn('flex flex-col gap-2', props.class)"
    :default-value="props.defaultValue"
    :model-value="props.modelValue"
    :orientation="props.orientation"
    v-bind="$attrs"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <slot />
  </TabsRoot>
</template>
