<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div
    data-slot="command-dialog-viewport"
    :class="cn(
      'fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(--spacing(4),4vh)] sm:py-[10vh]',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
