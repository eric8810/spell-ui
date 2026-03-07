<script setup lang="ts">
import { ComboboxContent, ComboboxPortal } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  sideOffset?: number
}

const props = withDefaults(defineProps<Props>(), {
  sideOffset: 4,
})

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <ComboboxPortal>
    <ComboboxContent
      data-slot="autocomplete-positioner"
      position="popper"
      :class="cn(
        'z-50 select-none origin-[--radix-combobox-content-transform-origin] outline-hidden transition-[transform,opacity] data-[state=closed]:scale-95 data-[state=closed]:opacity-0',
      )"
      :side-offset="props.sideOffset"
      v-bind="$attrs"
    >
      <span
        :class="cn(
          'relative flex max-h-full rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
          props.class
        )"
        data-slot="autocomplete-popup"
      >
        <div class="flex max-h-[min(var(--radix-combobox-content-available-height),23rem)] w-[var(--radix-combobox-trigger-width)] max-w-[var(--radix-combobox-content-available-width)] flex-col text-foreground">
          <slot />
        </div>
      </span>
    </ComboboxContent>
  </ComboboxPortal>
</template>
