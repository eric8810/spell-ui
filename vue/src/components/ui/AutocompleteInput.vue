<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ComboboxAnchor, ComboboxInput } from 'radix-vue'
import { ChevronsUpDownIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import AutocompleteClear from './AutocompleteClear.vue'
import AutocompleteTrigger from './AutocompleteTrigger.vue'

interface Props {
  class?: string
  showTrigger?: boolean
  showClear?: boolean
  startAddon?: boolean
  size?: 'sm' | 'default' | 'lg' | number
  type?: string
  disabled?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTrigger: false,
  showClear: false,
  startAddon: false,
  size: 'default',
  type: 'text',
  disabled: false,
  autoFocus: false,
})

const slots = useSlots()

const sizeValue = computed(() => props.size ?? 'default')
const visualSize = computed(() =>
  typeof sizeValue.value === 'number' ? 'default' : sizeValue.value
)
const nativeSize = computed(() =>
  typeof sizeValue.value === 'number' ? sizeValue.value : undefined
)
const hasStartAddon = computed(
  () => props.startAddon || Boolean(slots.startAddon)
)
const hasEndAdornment = computed(() => props.showTrigger || props.showClear)

const wrapperClassName = computed(() =>
  cn(
    'relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/6%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]',
    props.class
  )
)

const inputClassName = computed(() =>
  cn(
    'h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] leading-8.5 outline-none placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5',
    visualSize.value === 'sm' &&
      'h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5',
    visualSize.value === 'lg' &&
      'h-9.5 px-[calc(--spacing(3)-1px)] leading-9.5 sm:h-8.5 sm:leading-8.5',
    props.type === 'search' &&
      '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
    props.type === 'file' &&
      'text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm',
    hasStartAddon.value &&
      (visualSize.value === 'sm'
        ? 'ps-[calc(--spacing(7.5)-1px)] sm:ps-[calc(--spacing(7)-1px)]'
        : 'ps-[calc(--spacing(8.5)-1px)] sm:ps-[calc(--spacing(8)-1px)]'),
    hasEndAdornment.value &&
      (visualSize.value === 'sm' ? 'pe-6.5' : 'pe-7')
  )
)

const triggerClassName = computed(() =>
  cn(
    '-translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-[color,background-color,box-shadow,opacity] pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 [&_svg:not([class*=\'size-\'])]:size-4.5 sm:[&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    visualSize.value === 'sm' ? 'end-0' : 'end-0.5'
  )
)

const clearClassName = computed(() =>
  cn(
    '-translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-[color,background-color,box-shadow,opacity] pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 sm:size-7 [&_svg:not([class*=\'size-\'])]:size-4.5 sm:[&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    visualSize.value === 'sm' ? 'end-0' : 'end-0.5'
  )
)

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <ComboboxAnchor as-child>
    <div class="relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64">
      <div
        v-if="hasStartAddon"
        aria-hidden="true"
        class="[&_svg]:-mx-0.5 pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
        data-slot="autocomplete-start-addon"
      >
        <slot name="startAddon" />
      </div>

      <span
        :class="wrapperClassName"
        :data-size="visualSize"
        data-slot="autocomplete-input"
      >
        <ComboboxInput
          :auto-focus="autoFocus"
          :class="inputClassName"
          :disabled="disabled"
          :size="nativeSize"
          :type="type"
          v-bind="$attrs"
        />
      </span>

      <AutocompleteTrigger
        v-if="showTrigger"
        :class="triggerClassName"
      >
        <ChevronsUpDownIcon />
      </AutocompleteTrigger>

      <AutocompleteClear
        v-if="showClear"
        :class="clearClassName"
      />
    </div>
  </ComboboxAnchor>
</template>
