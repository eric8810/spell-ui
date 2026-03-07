<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type CSSProperties,
  type StyleValue,
} from 'vue'
import * as THREE from 'three'

interface AnimationConfig {
  animate: boolean
  speed: number
}

interface SingleColorConfig {
  mode: 'single'
  color: string
}

interface MultiColorConfig {
  mode: 'multi'
  color1: string
  color2: string
}

interface RandomColorConfig {
  mode: 'random'
}

type RaysColorConfig = SingleColorConfig | MultiColorConfig | RandomColorConfig

interface RaysUniforms {
  u_colors: { value: [THREE.Vector4, THREE.Vector4] }
  u_intensity: { value: number }
  u_rays: { value: number }
  u_reach: { value: number }
  u_time: { value: number }
  u_mouse: { value: [number, number] }
  u_resolution: { value: [number, number] }
  u_rayPos1: { value: [number, number] }
  u_rayPos2: { value: [number, number] }
}

interface Props {
  intensity?: number
  rays?: number
  reach?: number
  position?: number
  radius?: string
  backgroundColor?: string
  animation?: AnimationConfig
  raysColor?: RaysColorConfig
  style?: StyleValue
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 13,
  rays: 32,
  reach: 16,
  position: 50,
  radius: '0px',
  backgroundColor: '#000',
  animation: () => ({ animate: true, speed: 10 }),
  raysColor: () => ({ mode: 'single', color: '#639AFF' }),
})

const RAY_Y_POSITION_1 = -0.4
const RAY_Y_POSITION_2 = -0.5

const containerRef = ref<HTMLDivElement | null>(null)
const animationState = shallowRef<AnimationConfig>({ ...props.animation })
const randomColors = ref<[[number, number, number], [number, number, number]]>([
  [1, 1, 1],
  [1, 1, 1],
])

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let geometry: THREE.PlaneGeometry | null = null
let material: THREE.ShaderMaterial | null = null
let mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null
let resizeObserver: ResizeObserver | null = null
let frameId: number | null = null
let lastTime = 0

const containerStyle = computed<StyleValue>(() => {
  const baseStyle: CSSProperties = {
    position: 'absolute',
    inset: '0',
    zIndex: -1,
    borderRadius: props.radius,
    overflow: 'hidden',
    backgroundColor: props.backgroundColor,
  }

  return props.style ? [baseStyle, props.style] : baseStyle
})

const getUniforms = () => {
  if (!material) {
    return null
  }

  return material.uniforms as unknown as RaysUniforms
}

const resolvedColors = computed(() => {
  if (props.raysColor.mode === 'random') {
    return randomColors.value
  }

  if (props.raysColor.mode === 'multi') {
    return [colorToRGB(props.raysColor.color1), colorToRGB(props.raysColor.color2)] as const
  }

  return [colorToRGB(props.raysColor.color), colorToRGB(props.raysColor.color)] as const
})

const updateRandomColors = () => {
  if (props.raysColor.mode !== 'random') {
    return
  }

  const hue = Math.random() * 360
  const saturation = 60 + Math.random() * 40
  randomColors.value = [hslToRgb(hue, saturation, 50), hslToRgb(hue, saturation, 65)]
}

const updateRayPositions = (width: number, height: number) => {
  const uniforms = getUniforms()

  if (!uniforms) {
    return
  }

  uniforms.u_rayPos1.value = [(props.position / 100) * width, RAY_Y_POSITION_1 * height]
  uniforms.u_rayPos2.value = [
    (props.position / 100 + 0.02) * width,
    RAY_Y_POSITION_2 * height,
  ]
}

const updateUniforms = () => {
  const uniforms = getUniforms()

  if (!uniforms || !containerRef.value) {
    return
  }

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  const [color1, color2] = resolvedColors.value

  uniforms.u_colors.value = [
    new THREE.Vector4(color1[0], color1[1], color1[2], 1),
    new THREE.Vector4(color2[0], color2[1], color2[2], 1),
  ]
  uniforms.u_intensity.value = mapRange(props.intensity, 0, 100, 0, 0.5)
  uniforms.u_rays.value = mapRange(props.rays, 0, 100, 0, 0.3)
  uniforms.u_reach.value = mapRange(props.reach, 0, 100, 0, 0.5)
  uniforms.u_resolution.value = [width, height]
  updateRayPositions(width, height)
}

const handleResize = () => {
  if (!containerRef.value || !renderer || !camera) {
    return
  }

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  if (!width || !height) {
    return
  }

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  updateUniforms()
}

const animate = (time: number) => {
  if (!renderer || !scene || !camera || !material) {
    return
  }

  const currentAnimation = animationState.value

  if (!currentAnimation.animate) {
    lastTime = time
  }

  const delta = time - lastTime
  lastTime = time

  const uniforms = getUniforms()

  if (currentAnimation.animate && uniforms) {
    uniforms.u_time.value += (delta * currentAnimation.speed) / 1000 / 10
  }

  renderer.render(scene, camera)
  frameId = requestAnimationFrame(animate)
}

const disposeScene = () => {
  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }

  resizeObserver?.disconnect()
  resizeObserver = null

  renderer?.dispose()
  geometry?.dispose()
  material?.dispose()

  if (renderer?.domElement && containerRef.value?.contains(renderer.domElement)) {
    containerRef.value.removeChild(renderer.domElement)
  }

  scene = null
  camera = null
  renderer = null
  geometry = null
  material = null
  mesh = null
}

onMounted(() => {
  updateRandomColors()

  if (!containerRef.value) {
    return
  }

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  if (!width || !height) {
    return
  }

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  try {
    renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
      precision: 'highp',
      powerPreference: 'high-performance',
    })
  } catch {
    disposeScene()
    return
  }

  renderer.setSize(width, height)
  renderer.setPixelRatio(1)
  containerRef.value.appendChild(renderer.domElement)

  geometry = new THREE.PlaneGeometry(1024, 1024)
  material = new THREE.ShaderMaterial({
    fragmentShader: FRAGMENT_SHADER,
    vertexShader: VERTEX_SHADER,
    uniforms: {
      u_colors: {
        value: [
          new THREE.Vector4(1, 1, 1, 1),
          new THREE.Vector4(1, 1, 1, 1),
        ],
      },
      u_intensity: { value: mapRange(props.intensity, 0, 100, 0, 0.5) },
      u_rays: { value: mapRange(props.rays, 0, 100, 0, 0.3) },
      u_reach: { value: mapRange(props.reach, 0, 100, 0, 0.5) },
      u_time: { value: Math.random() * 10000 },
      u_mouse: { value: [0, 0] },
      u_resolution: { value: [width, height] },
      u_rayPos1: {
        value: [(props.position / 100) * width, RAY_Y_POSITION_1 * height],
      },
      u_rayPos2: {
        value: [(props.position / 100 + 0.02) * width, RAY_Y_POSITION_2 * height],
      },
    },
    wireframe: false,
    dithering: false,
    side: THREE.DoubleSide,
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  updateUniforms()
  lastTime = performance.now()
  frameId = requestAnimationFrame(animate)

  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(containerRef.value)
})

watch(
  () => props.animation,
  (value) => {
    animationState.value = { ...value }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.raysColor,
  () => {
    updateRandomColors()
    updateUniforms()
  },
  { deep: true },
)

watch(
  () => [props.intensity, props.rays, props.reach, props.position],
  () => {
    updateUniforms()
  },
)

onBeforeUnmount(() => {
  disposeScene()
})
</script>

<template>
  <div ref="containerRef" :class="props.class" :style="containerStyle" />
</template>

<script lang="ts">
const colorToRGB = (hex: string): [number, number, number] => {
  let red = 1
  let green = 1
  let blue = 1

  if (hex.startsWith('rgba(')) {
    const parts = hex.slice(5, -1).split(',')
    red = Number.parseInt(parts[0] ?? '255', 10) / 255
    green = Number.parseInt(parts[1] ?? '255', 10) / 255
    blue = Number.parseInt(parts[2] ?? '255', 10) / 255
  } else if (hex.startsWith('rgb(')) {
    const parts = hex.slice(4, -1).split(',')
    red = Number.parseInt(parts[0] ?? '255', 10) / 255
    green = Number.parseInt(parts[1] ?? '255', 10) / 255
    blue = Number.parseInt(parts[2] ?? '255', 10) / 255
  } else if (hex.startsWith('#')) {
    const color = hex.slice(1)

    if (color.length === 3) {
      const [redChannel = 'f', greenChannel = 'f', blueChannel = 'f'] = color
      red = Number.parseInt(redChannel + redChannel, 16) / 255
      green = Number.parseInt(greenChannel + greenChannel, 16) / 255
      blue = Number.parseInt(blueChannel + blueChannel, 16) / 255
    } else if (color.length >= 6) {
      red = Number.parseInt(color.slice(0, 2), 16) / 255
      green = Number.parseInt(color.slice(2, 4), 16) / 255
      blue = Number.parseInt(color.slice(4, 6), 16) / 255
    }
  }

  return [red, green, blue]
}

const hslToRgb = (hue: number, saturation: number, lightness: number): [number, number, number] => {
  saturation /= 100
  lightness /= 100

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const match = lightness - chroma / 2

  let red = 0
  let green = 0
  let blue = 0

  if (hue >= 0 && hue < 60) {
    red = chroma
    green = x
  } else if (hue < 120) {
    red = x
    green = chroma
  } else if (hue < 180) {
    green = chroma
    blue = x
  } else if (hue < 240) {
    green = x
    blue = chroma
  } else if (hue < 300) {
    red = x
    blue = chroma
  } else if (hue < 360) {
    red = chroma
    blue = x
  }

  return [red + match, green + match, blue + match]
}

const mapRange = (
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number,
) => {
  const percentage = (value - fromLow) / (fromHigh - fromLow)
  return toLow + percentage * (toHigh - toLow)
}

const VERTEX_SHADER = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAGMENT_SHADER = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);

    return clamp(
        (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;

    vec2 rayPos1 = u_rayPos1;
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214 * speed;
    float raySeedB1 = 21.11349 * speed;
    float raySpeed1 = 1.5 * speed;

    vec2 rayPos2 = u_rayPos2;
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910 * speed;
    float raySeedB2 = 18.0234 * speed;
    float raySpeed2 = 1.1 * speed;

    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;

    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;

    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

    gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`
</script>
