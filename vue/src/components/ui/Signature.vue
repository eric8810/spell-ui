<script setup lang="ts">
import { animate, inView } from 'motion'
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

const height = 100
const horizontalPadding = computed(() => props.fontSize * 0.1)
const topMargin = computed(() => Math.max(5, (height - props.fontSize) / 2))
const baseline = computed(() => Math.min(height - 5, topMargin.value + props.fontSize))
const maskId = `signature-reveal-${Math.random().toString(36).slice(2, 10)}`

let stopInView: VoidFunction | null = null
let hasAnimated = false
let loadVersion = 0
let animations: ReturnType<typeof animate>[] = []

const getMaskPaths = () =>
  Array.from(svgRef.value?.querySelectorAll<SVGPathElement>('[data-signature-mask-path]') ?? [])

const getStrokePaths = () =>
  Array.from(svgRef.value?.querySelectorAll<SVGPathElement>('[data-signature-stroke-path]') ?? [])

const stopAnimations = () => {
  for (const animation of animations) {
    animation.stop()
  }

  animations = []
}

const resetAnimation = async () => {
  await nextTick()
  stopAnimations()

  for (const path of [...getMaskPaths(), ...getStrokePaths()]) {
    animate(path, { pathLength: 0, opacity: 0 }, { duration: 0 })
  }
}

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
  await resetAnimation()

  if (!props.inView) {
    void startAnimation()
  }
}

const startAnimation = async () => {
  if (props.once && hasAnimated) {
    return
  }

  hasAnimated = true
  await resetAnimation()

  for (const [index, path] of getMaskPaths().entries()) {
    animations.push(
      animate(
        path,
        { pathLength: [0, 1] },
        {
          delay: props.delay + index * 0.2,
          duration: props.duration,
          ease: 'easeInOut',
        },
      ),
      animate(
        path,
        { opacity: [0, 1] },
        {
          delay: props.delay + index * 0.2 + 0.01,
          duration: 0.01,
        },
      ),
    )
  }

  for (const [index, path] of getStrokePaths().entries()) {
    animations.push(
      animate(
        path,
        { pathLength: [0, 1] },
        {
          delay: props.delay + index * 0.2,
          duration: props.duration,
          ease: 'easeInOut',
        },
      ),
      animate(
        path,
        { opacity: [0, 1] },
        {
          delay: props.delay + index * 0.2 + 0.01,
          duration: 0.01,
        },
      ),
    )
  }
}

const observeVisibility = async () => {
  stopInView?.()
  stopInView = null

  if (!props.inView) {
    return
  }

  await nextTick()

  if (!svgRef.value) {
    return
  }

  stopInView = inView(
    svgRef.value,
    () => {
      void startAnimation()

      if (props.once) {
        return
      }

      return () => {
        void resetAnimation()
      }
    },
    { amount: 0 },
  )
}

watch(
  () => [props.text, props.fontSize, props.duration, props.delay],
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
    await resetAnimation()
    await observeVisibility()

    if (!props.inView) {
      void startAnimation()
    }
  },
)

onMounted(async () => {
  await loadPaths()
  await observeVisibility()
})

onBeforeUnmount(() => {
  stopInView?.()
  stopInView = null
  stopAnimations()
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
          data-signature-mask-path
          :d="pathData"
          stroke="white"
          :stroke-width="props.fontSize * 0.22"
          fill="none"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
        />
      </mask>
    </defs>

    <path
      v-for="(pathData, index) in paths"
      :key="`stroke-${index}`"
      data-signature-stroke-path
      :d="pathData"
      :stroke="props.color"
      stroke-width="2"
      fill="none"
      vector-effect="non-scaling-stroke"
      stroke-linecap="butt"
      stroke-linejoin="round"
      pathLength="1"
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
