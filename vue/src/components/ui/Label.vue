<script setup lang="ts">
import { Label as LabelPrimitive } from 'radix-vue'
import { cn } from '@/lib/utils'

interface LabelProps {
  class?: string
  for?: string
}

const props = defineProps<LabelProps>()
</script>

<template>
  <LabelPrimitive
    :for="for"
    :class="
      cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        props.class
      )
    "
    data-slot="label"
  >
    <slot />
  </LabelPrimitive>
</template>
