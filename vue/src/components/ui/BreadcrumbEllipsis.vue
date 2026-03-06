<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    :class="cn('flex size-9 items-center justify-center', props.class)"
    v-bind="$attrs"
  >
    <MoreHorizontal :size="16" />
    <span class="sr-only">More</span>
  </span>
</template>
