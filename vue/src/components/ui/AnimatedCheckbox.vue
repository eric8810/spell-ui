<script setup lang="ts">
import { animate } from 'motion'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  title: {
    type: String,
    default: 'Implement Checkbox',
  },
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    default: undefined,
  },
  class: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits<{
  checkedChange: [checked: boolean]
  'update:modelValue': [checked: boolean]
}>()

const slots = useSlots()
const checkPathRef = ref<SVGPathElement | null>(null)
const strikeRef = ref<HTMLElement | null>(null)
const checked = ref(props.modelValue ?? props.defaultChecked)
const isControlled = computed(() => props.modelValue !== undefined)

let checkAnimations: ReturnType<typeof animate>[] = []
let strikeAnimation: ReturnType<typeof animate> | null = null

const stopCheckAnimations = () => {
  for (const animation of checkAnimations) {
    animation.stop()
  }

  checkAnimations = []
}

const stopStrikeAnimation = () => {
  if (strikeAnimation) {
    strikeAnimation.stop()
    strikeAnimation = null
  }
}

const syncDecorations = (value: boolean) => {
  stopCheckAnimations()
  stopStrikeAnimation()

  if (checkPathRef.value) {
    animate(checkPathRef.value, { pathLength: value ? 1 : 0, opacity: value ? 1 : 0 }, { duration: 0 })
  }

  if (strikeRef.value) {
    strikeRef.value.style.width = value ? '100%' : '0%'
    strikeRef.value.style.opacity = value ? '1' : '0'
  }
}

const animateCheckPath = async (value: boolean) => {
  await nextTick()

  if (!checkPathRef.value) {
    return
  }

  stopCheckAnimations()
  checkAnimations = [
    animate(
      checkPathRef.value,
      { pathLength: value ? 1 : 0 },
      {
        duration: 0.3,
        ease: 'easeOut',
      },
    ),
    animate(
      checkPathRef.value,
      { opacity: value ? 1 : 0 },
      {
        duration: 0,
      },
    ),
  ]
}

const animateStrike = async (value: boolean) => {
  await nextTick()

  if (!strikeRef.value) {
    return
  }

  stopStrikeAnimation()
  strikeAnimation = animate(
    strikeRef.value,
    { width: value ? '100%' : '0%', opacity: value ? 1 : 0 },
    { type: 'spring', duration: 0.4, bounce: 0.2 },
  )
}

watch(
  () => props.modelValue,
  async (value) => {
    if (value !== undefined) {
      checked.value = value
      await animateCheckPath(value)
      await animateStrike(value)
    }
  },
)

watch(
  () => props.defaultChecked,
  async (value) => {
    if (!isControlled.value) {
      checked.value = value
      await animateCheckPath(value)
      await animateStrike(value)
    }
  },
)

const toggle = async () => {
  const nextChecked = !checked.value

  if (!isControlled.value) {
    checked.value = nextChecked
  }

  await animateCheckPath(nextChecked)
  await animateStrike(nextChecked)
  emit('update:modelValue', nextChecked)
  emit('checkedChange', nextChecked)
}

const showSlot = computed(() => Boolean(slots.default))

onMounted(() => {
  syncDecorations(checked.value)
})

onBeforeUnmount(() => {
  stopCheckAnimations()
  stopStrikeAnimation()
})
</script>

<template>
  <div
    :class="cn('flex cursor-pointer items-center gap-3 select-none', props.class)"
    role="checkbox"
    tabindex="0"
    :aria-checked="checked"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
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
            ref="checkPathRef"
            d="M 0 4.5 L 3.182 8 L 10 0"
            fill="transparent"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            transform="translate(5 6)"
            pathLength="1"
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
        ref="strikeRef"
        class="absolute left-0 top-1/2 h-[1.5px] w-0 -translate-y-1/2 origin-left bg-muted-foreground opacity-0"
      />
    </div>
  </div>
</template>
