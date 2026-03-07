<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Slot } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

type SizeVariant = 'sm' | 'default' | 'lg'

interface Props {
  size?: SizeVariant
  borderColor?: string
  class?: string
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  borderColor: 'var(--rotating-border-color)',
  asChild: false,
})

const sizeMap: Record<SizeVariant, string> = {
  sm: 'h-8 rounded-full gap-1.5 px-3 text-sm',
  default: 'h-9 rounded-full px-4 py-2 text-sm',
  lg: 'h-10 rounded-full px-6 text-sm',
}

const borderRadiusMap: Record<SizeVariant, number> = {
  sm: 16,
  default: 18,
  lg: 20,
}

const rootRef = ref<HTMLElement | null>(null)
const dimensions = reactive({ width: 0, height: 0 })
let resizeObserver: ResizeObserver | null = null

const radius = computed(() => borderRadiusMap[props.size])
const buttonClass = computed(() =>
  cn(
    'relative z-0 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap bg-neutral-100 font-[550] text-primary transition-colors pointer-events-auto [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-muted/50 dark:hover:bg-transparent hover:bg-transparent',
    sizeMap[props.size],
    props.class,
  ),
)

const borderPath = computed(() => {
  const { width, height } = dimensions
  const currentRadius = radius.value

  if (!width || !height) {
    return ''
  }

  return `M${currentRadius},0.5 H${width - currentRadius} A${currentRadius},${currentRadius} 0 0 1 ${width - 0.5},${currentRadius} V${
    height - currentRadius
  } A${currentRadius},${currentRadius} 0 0 1 ${width - currentRadius},${height - 0.5} H${currentRadius} A${currentRadius},${currentRadius} 0 0 1 0.5,${
    height - currentRadius
  } V${currentRadius} A${currentRadius},${currentRadius} 0 0 1 ${currentRadius},0.5 Z`
})

const updateDimensions = () => {
  if (!rootRef.value) {
    return
  }

  const { width, height } = rootRef.value.getBoundingClientRect()
  dimensions.width = width
  dimensions.height = height
}

onMounted(() => {
  updateDimensions()

  if (!rootRef.value) {
    return
  }

  resizeObserver = new ResizeObserver(updateDimensions)
  resizeObserver.observe(rootRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<template>
  <div ref="rootRef" class="group relative inline-block pointer-events-none">
    <div
      class="pointer-events-none absolute inset-[2px] z-10 opacity-0 transition-all duration-200 ease-out group-hover:inset-0 group-hover:opacity-100"
      :style="{ borderRadius: `${radius}px` }"
    >
      <svg
        v-if="dimensions.width && dimensions.height"
        :width="dimensions.width"
        :height="dimensions.height"
        :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`"
        aria-hidden="true"
        preserveAspectRatio="none"
        class="pointer-events-none absolute left-0 top-0 h-full w-full"
      >
        <path
          :d="borderPath"
          fill="none"
          :stroke="borderColor"
          stroke-width="1"
          stroke-dasharray="6,4"
          stroke-dashoffset="0"
          class="group-hover:animate-[spell-ui-dash-flow_1s_linear_infinite]"
        />
      </svg>
    </div>

    <Slot v-if="asChild" :class="buttonClass" v-bind="$attrs">
      <slot />
    </Slot>
    <button
      v-else
      :class="buttonClass"
      type="button"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </div>
</template>

<style>
@keyframes spell-ui-dash-flow {
  to {
    stroke-dashoffset: -10;
  }
}
</style>
