<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: string
  size?: 'sm' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
})

const sizeClass = computed(() => (props.size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'))

const variantClass = computed(() => {
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border bg-transparent text-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    red: 'bg-red-500/15 text-red-700 dark:text-red-300',
    blue: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    green: 'bg-green-500/15 text-green-700 dark:text-green-300',
    yellow: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300',
    purple: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
    pink: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
    orange: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
    cyan: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
    indigo: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
    violet: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    rose: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    lime: 'bg-lime-500/15 text-lime-700 dark:text-lime-300',
    emerald: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    sky: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    fuchsia: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
  }

  return variants[props.variant] ?? variants.default
})
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap',
      sizeClass,
      variantClass,
    )"
  >
    <slot />
  </span>
</template>
