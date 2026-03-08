<script setup lang="ts">
import { CheckIcon, CopyIcon } from 'lucide-vue-next'
import { computed, ref, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  value: string
  size?: 'sm' | 'default' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  class: '',
})

const emit = defineEmits<{
  copied: [value: string]
}>()

const attrs = useAttrs()
const copied = ref(false)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return { button: 'h-8 w-8', icon: 14 }
    case 'lg':
      return { button: 'h-12 w-12', icon: 20 }
    default:
      return { button: 'h-9 w-9', icon: 16 }
  }
})

const copy = async () => {
  await navigator.clipboard.writeText(props.value)
  copied.value = true
  emit('copied', props.value)
  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <button
    type="button"
    aria-label="Copy to clipboard"
    v-bind="attrs"
    :class="
      cn(
        'relative inline-flex cursor-pointer items-center justify-center rounded-md text-neutral-900 transition-all duration-200 ease-out active:scale-[0.97] dark:text-neutral-50',
        sizeClass.button,
        props.class,
      )
    "
    @click="copy"
  >
    <div
      :class="
        cn(
          'transition-all duration-200',
          copied ? 'scale-100 opacity-100 blur-none' : 'scale-70 opacity-0 blur-[2px]',
        )
      "
    >
      <CheckIcon :size="sizeClass.icon" :stroke-width="2" />
    </div>

    <div
      :class="
        cn(
          'absolute transition-all duration-200',
          copied ? 'scale-0 opacity-0 blur-[2px]' : 'scale-100 opacity-100 blur-none',
        )
      "
    >
      <CopyIcon :size="sizeClass.icon" :stroke-width="2" />
    </div>
  </button>
</template>
