<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  defaultChecked?: boolean
  modelValue?: boolean
  class?: string
  onCheckedChange?: (checked: boolean) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Implement Checkbox',
  defaultChecked: false,
})

const emit = defineEmits<{
  checkedChange: [checked: boolean]
  'update:modelValue': [checked: boolean]
}>()

const slots = useSlots()
const checked = ref(props.modelValue ?? props.defaultChecked)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      checked.value = value
    }
  },
)

const toggle = () => {
  const nextChecked = !checked.value

  if (props.modelValue === undefined) {
    checked.value = nextChecked
  }

  props.onCheckedChange?.(nextChecked)
  emit('update:modelValue', nextChecked)
  emit('checkedChange', nextChecked)
}

const showSlot = computed(() => Boolean(slots.default))
</script>

<template>
  <div
    :class="cn('flex cursor-pointer items-center gap-3 select-none', props.class)"
    @click="toggle"
  >
    <div
      :class="
        cn(
          'flex size-4.5 items-center justify-center rounded-[6px] border-[1.5px] transition-colors duration-200',
          checked
            ? 'border-transparent bg-foreground'
            : 'border-muted-foreground/40 bg-transparent hover:border-muted-foreground/60',
        )
      "
    >
      <svg viewBox="0 0 20 20" class="size-full text-background">
        <path
          d="M 0 4.5 L 3.182 8 L 10 0"
          fill="transparent"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform="translate(5 6)"
          :style="{
            strokeDasharray: 14,
            strokeDashoffset: checked ? 0 : 14,
            opacity: checked ? 1 : 0,
            transitionProperty: 'stroke-dashoffset, opacity',
            transitionDuration: '0.3s, 0s',
            transitionTimingFunction: 'ease-out, linear',
          }"
        />
      </svg>
    </div>

    <div class="relative">
      <span
        :class="
          cn(
            'text-base font-medium transition-colors duration-200',
            checked ? 'text-muted-foreground' : 'text-foreground',
          )
        "
      >
        <slot v-if="showSlot" />
        <template v-else>{{ props.title }}</template>
      </span>
      <span
        class="absolute left-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-muted-foreground"
        :style="{
          width: checked ? '100%' : '0px',
          opacity: checked ? 1 : 0,
          transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }"
      />
    </div>
  </div>
</template>
