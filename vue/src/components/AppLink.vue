<script setup lang="ts">
import { computed } from 'vue'
import { isExternalLink, navigate } from '@/router'
import { cn } from '@/lib/utils'

interface Props {
  to: string
  class?: string
  target?: string
}

const props = defineProps<Props>()

const external = computed(() => isExternalLink(props.to) || props.target === '_blank')

const handleClick = (event: MouseEvent) => {
  if (external.value || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) {
    return
  }

  event.preventDefault()
  navigate(props.to)
}
</script>

<template>
  <a
    :href="to"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="cn(props.class)"
    @click="handleClick"
  >
    <slot />
  </a>
</template>
