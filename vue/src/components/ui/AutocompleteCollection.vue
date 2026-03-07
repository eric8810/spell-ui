<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  items?: unknown[]
  getKey?: (item: unknown, index: number) => string | number
}

const props = defineProps<Props>()

const hasItems = computed(() => Array.isArray(props.items))

const getItemKey = (item: unknown, index: number) =>
  props.getKey ? props.getKey(item, index) : index

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div
    data-slot="autocomplete-collection"
    :class="cn('contents', props.class)"
    v-bind="$attrs"
  >
    <template v-if="hasItems">
      <slot
        v-for="(item, index) in props.items"
        :key="getItemKey(item, index)"
        :index="index"
        :item="item"
      />
    </template>

    <slot v-else />
  </div>
</template>
