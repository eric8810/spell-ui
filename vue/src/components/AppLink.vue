<script setup lang="ts">
import { computed } from 'vue'
import { isExternalLink, navigate, toInternalHref } from '@/router'
import { cn } from '@/lib/utils'

interface Props {
  to: string
  class?: string
  target?: string
}

const props = defineProps<Props>()

const external = computed(() => isExternalLink(props.to))
const href = computed(() => (external.value ? props.to : toInternalHref(props.to)))

const handleClick = (event: MouseEvent) => {
  if (
    external.value ||
    props.target === '_blank' ||
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  event.preventDefault()
  navigate(props.to)
}
</script>

<template>
  <a
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="cn(props.class)"
    @click="handleClick"
  >
    <slot />
  </a>
</template>
