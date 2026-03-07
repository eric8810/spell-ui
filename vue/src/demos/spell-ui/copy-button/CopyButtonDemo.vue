<script setup lang="ts">
import { CheckIcon, CopyIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'custom'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const copied = ref<string | null>(null)
const sizes = ['sm', 'default', 'lg'] as const

type SizeKey = typeof sizes[number]

const sizeMap: Record<SizeKey, { button: string; icon: number; label: string; value: string }> = {
  sm: { button: 'h-8 w-8', icon: 14, label: 'Small', value: 'Small' },
  default: { button: 'h-9 w-9', icon: 16, label: 'Default', value: 'Default' },
  lg: { button: 'h-12 w-12', icon: 20, label: 'Large', value: 'Large' },
}

const copyValue = async (value: string) => {
  await navigator.clipboard.writeText(value)
  copied.value = value
  window.setTimeout(() => {
    if (copied.value === value) {
      copied.value = null
    }
  }, 1500)
}
</script>

<template>
  <div v-if="props.variant === 'custom'" class="flex items-center gap-4">
    <button
      v-for="size in sizes"
      :key="size"
      type="button"
      :aria-label="copied === sizeMap[size].value ? 'Copied' : 'Copy to clipboard'"
      :class="cn('relative inline-flex cursor-pointer items-center justify-center rounded-md text-neutral-900 transition-all duration-200 ease-out active:scale-[0.97] dark:text-neutral-50', sizeMap[size].button)"
      @click="copyValue(sizeMap[size].value)"
    >
      <div :class="cn('transition-all duration-200', copied === sizeMap[size].value ? 'scale-100 opacity-100 blur-none' : 'scale-70 opacity-0 blur-[2px]')">
        <CheckIcon :size="sizeMap[size].icon" :stroke-width="2" />
      </div>
      <div :class="cn('absolute transition-all duration-200', copied === sizeMap[size].value ? 'scale-0 opacity-0 blur-[2px]' : 'scale-100 opacity-100 blur-none')">
        <CopyIcon :size="sizeMap[size].icon" :stroke-width="2" />
      </div>
    </button>
  </div>

  <button
    v-else
    type="button"
    aria-label="Copy to clipboard"
    class="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-neutral-900 transition-all duration-200 ease-out active:scale-[0.97] dark:text-neutral-50"
    @click="copyValue('Spell 🪄')"
  >
    <div :class="cn('transition-all duration-200', copied === 'Spell 🪄' ? 'scale-100 opacity-100 blur-none' : 'scale-70 opacity-0 blur-[2px]')">
      <CheckIcon :size="16" :stroke-width="2" />
    </div>
    <div :class="cn('absolute transition-all duration-200', copied === 'Spell 🪄' ? 'scale-0 opacity-0 blur-[2px]' : 'scale-100 opacity-100 blur-none')">
      <CopyIcon :size="16" :stroke-width="2" />
    </div>
  </button>
</template>
