<script setup lang="ts">
import { Music2 } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { cn } from '@/lib/utils'

interface SpotifyData {
  title: string
  artist: string
  image: string
  link: string
  audio?: string
}

interface Props {
  url: string
  class?: string
}

const props = defineProps<Props>()

const SPOTIFY_ENDPOINT = 'https://talks.superalign.cn/spell-ui/api/spotify'

const data = ref<SpotifyData | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const isPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const requestId = ref(0)
const svgId = useId()

const maskId = computed(() => `spotify-mask-${svgId}`)
const filterIds = computed(() =>
  Array.from({ length: 10 }, (_, index) => `spotify-filter-${index}-${svgId}`),
)

const stopAudio = () => {
  audioRef.value?.pause()
  audioRef.value = null
  isPlaying.value = false
}

const fetchSpotifyData = async () => {
  const currentRequest = ++requestId.value
  isLoading.value = true
  hasError.value = false
  stopAudio()

  try {
    const response = await fetch(`${SPOTIFY_ENDPOINT}?url=${encodeURIComponent(props.url)}`)

    if (!response.ok) {
      throw new Error('Failed to fetch Spotify metadata')
    }

    const payload = (await response.json()) as SpotifyData

    if (currentRequest !== requestId.value) {
      return
    }

    data.value = payload
  } catch {
    if (currentRequest !== requestId.value) {
      return
    }

    data.value = null
    hasError.value = true
  } finally {
    if (currentRequest === requestId.value) {
      isLoading.value = false
    }
  }
}

const handlePlayPause = async () => {
  if (!data.value?.audio) {
    return
  }

  if (!audioRef.value || audioRef.value.src !== data.value.audio) {
    stopAudio()

    const audio = new Audio(data.value.audio)
    audio.volume = 0.3
    audio.addEventListener('ended', () => {
      isPlaying.value = false
    })
    audioRef.value = audio
  }

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    return
  }

  try {
    await audioRef.value.play()
    isPlaying.value = true
  } catch {
    isPlaying.value = false
  }
}

watch(
  () => props.url,
  () => {
    void fetchSpotifyData()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stopAudio()
})
</script>

<template>
  <div
    v-if="isLoading"
    :class="
      cn(
        'relative flex h-full max-h-[100px] w-full items-stretch justify-center overflow-hidden rounded-2xl border border-border bg-muted/50 p-3',
        props.class,
      )
    "
  >
    <div class="aspect-square w-full max-w-[75px] animate-pulse self-center rounded-lg bg-muted" />
    <div class="z-10 flex w-full flex-col justify-end">
      <div class="flex flex-col items-end gap-1 pl-6">
        <div class="h-4 w-24 animate-pulse rounded bg-muted" />
        <div class="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  </div>

  <div
    v-else-if="hasError || !data"
    :class="
      cn(
        'flex h-[100px] w-full items-center justify-center rounded-2xl border border-border bg-muted/50 p-6 text-muted-foreground',
        props.class,
      )
    "
  >
    <p class="text-sm">Failed to load Spotify data</p>
  </div>

  <div
    v-else
    :class="
      cn(
        'relative flex h-full max-h-[100px] w-full items-stretch justify-center overflow-hidden rounded-2xl border border-border p-3',
        props.class,
      )
    "
  >
    <div class="pointer-events-none absolute left-1/2 top-1/2 z-0 block aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2">
      <div class="pointer-events-none flex h-full select-none opacity-100">
        <img
          :src="data.image"
          alt=""
          class="absolute left-0 top-0 block h-full w-full brightness-150 blur-[50px]"
        />
        <div class="absolute left-0 top-0 h-full w-full bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_0,_rgba(0,_0,_0,_.8))]" />
      </div>
    </div>

    <button
      type="button"
      :class="
        cn(
          'group relative z-[1] w-full max-w-[75px] self-center',
          data.audio && 'cursor-pointer',
        )
      "
      :aria-label="data.audio ? (isPlaying ? 'Pause preview' : 'Play preview') : 'Spotify artwork'"
      @click="data.audio ? handlePlayPause() : undefined"
    >
      <img
        :src="data.image"
        :alt="data.title"
        :class="
          cn(
            'pointer-events-none relative z-[1] min-h-[75px] min-w-[75px] w-full select-none rounded-lg object-cover shadow-md transition-transform duration-300 ease-out',
            data.audio && 'group-hover:-translate-x-0.5',
            isPlaying && '-translate-x-0.5',
          )
        "
      />

      <div
        v-if="data.audio"
        :class="
          cn(
            'absolute left-1/2 top-1/2 -z-[1] size-[80%] -translate-y-1/2 transition-all duration-300',
            isPlaying ? 'translate-x-[-10%]' : 'translate-x-[-50%] group-hover:translate-x-[-10%]',
          )
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 110 110"
          class="size-full animate-spin"
          :style="{
            animationDuration: '3s',
            animationPlayState: isPlaying ? 'running' : 'paused',
          }"
        >
          <circle cx="55" cy="55" r="55" fill="#000" />
          <mask :id="maskId" width="110" height="110" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type: alpha">
            <circle cx="55" cy="55" r="55" fill="#000" />
          </mask>
          <g :mask="`url(#${maskId})`">
            <g :filter="`url(#${filterIds[0]})`">
              <circle cx="55" cy="55" r="51.5" stroke="#fff" stroke-opacity="0.21" />
            </g>
            <g :filter="`url(#${filterIds[1]})`">
              <circle cx="55" cy="55" r="47.5" stroke="#fff" stroke-opacity="0.21" />
            </g>
            <g :filter="`url(#${filterIds[2]})`">
              <circle cx="55" cy="55" r="45.5" stroke="#fff" stroke-opacity="0.21" />
            </g>
            <g :filter="`url(#${filterIds[3]})`">
              <circle cx="55" cy="55" r="43.5" stroke="#fff" stroke-opacity="0.21" />
            </g>
            <g :filter="`url(#${filterIds[4]})`">
              <circle cx="55" cy="55" r="37.5" stroke="#fff" stroke-opacity="0.21" />
            </g>
            <g :filter="`url(#${filterIds[5]})`">
              <circle cx="55" cy="55" r="34.5" stroke="#fff" stroke-opacity="0.21" />
            </g>
            <g :filter="`url(#${filterIds[6]})`" opacity="0.4">
              <path fill="#fff" d="M-14 38l68 19.579L-14 74V38z" />
            </g>
            <g :filter="`url(#${filterIds[7]})`" opacity="0.4">
              <path fill="#fff" d="M123 38L55 57.579 123 74V38z" />
            </g>
            <g :filter="`url(#${filterIds[8]})`" opacity="0.4">
              <path fill="#fff" d="M36.5 124.5l19.579-68 16.421 68h-36z" />
            </g>
            <g :filter="`url(#${filterIds[9]})`" opacity="0.4">
              <path fill="#fff" d="M36.5-12.5l19.579 68 16.421-68h-36z" />
            </g>
          </g>
          <defs>
            <filter :id="filterIds[0]" width="108" height="108" x="1" y="1" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1" />
            </filter>
            <filter :id="filterIds[1]" width="100" height="100" x="5" y="5" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1" />
            </filter>
            <filter :id="filterIds[2]" width="96" height="96" x="7" y="7" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1" />
            </filter>
            <filter :id="filterIds[3]" width="92" height="92" x="9" y="9" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1" />
            </filter>
            <filter :id="filterIds[4]" width="80" height="80" x="15" y="15" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1" />
            </filter>
            <filter :id="filterIds[5]" width="74" height="74" x="18" y="18" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1" />
            </filter>
            <filter :id="filterIds[6]" width="100" height="68" x="-30" y="22" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="8" />
            </filter>
            <filter :id="filterIds[7]" width="100" height="68" x="39" y="22" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="8" />
            </filter>
            <filter :id="filterIds[8]" width="68" height="100" x="20.5" y="40.5" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="8" />
            </filter>
            <filter :id="filterIds[9]" width="68" height="100" x="20.5" y="-28.5" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="8" />
            </filter>
          </defs>
        </svg>
      </div>
    </button>

    <div class="z-10 flex w-full flex-col justify-between">
      <div class="flex self-end">
        <a
          :href="data.link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex size-6 items-center justify-center rounded-full bg-[#1DB954] text-white"
          aria-label="Open in Spotify"
        >
          <Music2 class="size-3.5" />
        </a>
      </div>

      <div class="pl-6 text-end">
        <h2 class="whitespace-nowrap text-sm font-semibold tracking-[-.006em] text-[#D6D1D4]">
          {{ data.title }}
        </h2>
        <h2 class="whitespace-nowrap text-sm font-medium tracking-[-.006em] text-[#BAAEBA]">
          {{ data.artist }}
        </h2>
      </div>
    </div>
  </div>
</template>
