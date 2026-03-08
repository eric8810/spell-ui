<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import opentype from 'opentype.js'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  text?: string
  color?: string
  fontSize?: number
  duration?: number
  delay?: number
  class?: string
  inView?: boolean
  once?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Signature',
  color: '#000',
  fontSize: 14,
  duration: 1.5,
  delay: 0,
  class: '',
  inView: false,
  once: true,
})

const attrs = useAttrs()
const svgRef = ref<SVGSVGElement | null>(null)
const paths = ref<string[]>([])
const width = ref(300)
const isVisible = ref(false)

const height = 100
const horizontalPadding = computed(() => props.fontSize * 0.1)
const topMargin = computed(() => Math.max(5, (height - props.fontSize) / 2))
const baseline = computed(() => Math.min(height - 5, topMargin.value + props.fontSize))
const maskId = `signature-reveal-${Math.random().toString(36).slice(2, 10)}`

let observer: IntersectionObserver | null = null
let hasAnimated = false
let loadVersion = 0

const loadPaths = async () => {
  loadVersion += 1
  const currentVersion = loadVersion

  try {
    let font: opentype.Font | null = null
    const fontPaths = [
      '/LastoriaBoldRegular.otf',
      './LastoriaBoldRegular.otf',
      `${window.location.origin}/LastoriaBoldRegular.otf`,
    ]

    for (const path of fontPaths) {
      try {
        font = await opentype.load(path)
        break
      } catch {
        continue
      }
    }

    if (!font) {
      throw new Error('Font could not be loaded from any path')
    }

    let x = horizontalPadding.value
    const nextPaths: string[] = []

    for (const char of props.text) {
      const glyph = font.charToGlyph(char)
      const path = glyph.getPath(x, baseline.value, props.fontSize)
      nextPaths.push(path.toPathData(3))

      const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm
      x += advanceWidth * (props.fontSize / font.unitsPerEm)
    }

    if (currentVersion !== loadVersion) {
      return
    }

    paths.value = nextPaths
    width.value = x + horizontalPadding.value
  } catch {
    if (currentVersion !== loadVersion) {
      return
    }

    paths.value = []
    width.value = props.text.length * props.fontSize * 0.6
  }

  await nextTick()
  resetAnimation()

  if (!props.inView) {
    startAnimation()
  }
}

const resetAnimation = () => {
  isVisible.value = false
}

const startAnimation = () => {
  if (props.once && hasAnimated) {
    return
  }

  hasAnimated = true

  requestAnimationFrame(() => {
    isVisible.value = true
  })
}

const observeVisibility = () => {
  observer?.disconnect()
  observer = null

  if (!props.inView || !svgRef.value) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      if (entry.isIntersecting) {
        startAnimation()

        if (props.once) {
          observer?.disconnect()
          observer = null
        }
      } else if (!props.once) {
        resetAnimation()
      }
    },
    { threshold: 0 },
  )

  observer.observe(svgRef.value)
}

const getAnimatedPathStyle = (index: number) => ({
  strokeDasharray: 1,
  strokeDashoffset: isVisible.value ? 0 : 1,
  opacity: isVisible.value ? 1 : 0,
  transitionProperty: 'stroke-dashoffset, opacity',
  transitionDuration: `${props.duration}s, 0.01s`,
  transitionTimingFunction: 'ease-in-out, linear',
  transitionDelay: `${props.delay + index * 0.2}s, ${props.delay + index * 0.2 + 0.01}s`,
})

watch(
  () => [props.text, props.fontSize],
  () => {
    hasAnimated = false

    if (typeof window !== 'undefined') {
      void loadPaths()
    }
  },
)

watch(
  () => [props.inView, props.once],
  async () => {
    await nextTick()
    observeVisibility()

    if (!props.inView) {
      resetAnimation()
      startAnimation()
    }
  },
)

onMounted(async () => {
  await loadPaths()
  observeVisibility()

  if (!props.inView) {
    startAnimation()
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <svg
    ref="svgRef"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    :class="cn(props.class, attrs.class as string | undefined)"
    v-bind="attrs"
  >
    <defs>
      <mask :id="maskId" maskUnits="userSpaceOnUse">
        <path
          v-for="(pathData, index) in paths"
          :key="`mask-${index}`"
          :d="pathData"
          stroke="white"
          :stroke-width="props.fontSize * 0.22"
          fill="none"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
          :style="getAnimatedPathStyle(index)"
        />
      </mask>
    </defs>

    <path
      v-for="(pathData, index) in paths"
      :key="`stroke-${index}`"
      :d="pathData"
      :stroke="props.color"
      stroke-width="2"
      fill="none"
      vector-effect="non-scaling-stroke"
      stroke-linecap="butt"
      stroke-linejoin="round"
      pathLength="1"
      :style="getAnimatedPathStyle(index)"
    />

    <g :mask="`url(#${maskId})`">
      <path
        v-for="(pathData, index) in paths"
        :key="`fill-${index}`"
        :d="pathData"
        :fill="props.color"
      />
    </g>
  </svg>
</template>
