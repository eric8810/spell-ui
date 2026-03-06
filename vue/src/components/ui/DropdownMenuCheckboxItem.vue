<template>
  <DropdownMenuCheckboxItem
    data-slot="dropdown-menu-checkbox-item"
    :class="cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      props.class
    )"
    :checked="checked"
    v-bind="$attrs"
  >
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <CheckIcon class="size-4" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItem>
</template>

<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator } from 'radix-vue'
import { CheckIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  checked?: boolean | 'indeterminate'
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false
})
</script>
