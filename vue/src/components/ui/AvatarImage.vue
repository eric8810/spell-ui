<script setup lang="ts">
import { AvatarImage } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  src?: string
  alt?: string
}

const props = defineProps<Props>()
</script>

<template>
  <AvatarImage
    data-slot="avatar-image"
    :class="cn('aspect-square size-full', props.class)"
    :src="props.src || ''"
    :alt="props.alt || ''"
    v-bind="$attrs"
  />
</template>
