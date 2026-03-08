<script setup lang="ts">
import { Check, Link2 } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  enrichTweet,
  fetchTweet,
  formatTweetNumber,
  type EnrichedTweet,
  type Tweet,
  type TweetVideo,
} from '@/lib/tweet'
import { cn } from '@/lib/utils'

interface Props {
  apiUrl?: string
  id: string
  class?: string
  showCopyLink?: boolean
  showDate?: boolean
  showLikeButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCopyLink: true,
  showDate: true,
  showLikeButton: true,
})

const copied = ref(false)
const copyTimeoutId = ref<number | null>(null)
const error = ref(false)
const isLoading = ref(true)
const requestId = ref(0)
const tweet = ref<Tweet | null>(null)

const tweetData = computed<EnrichedTweet | null>(() => (tweet.value ? enrichTweet(tweet.value) : null))
const showActions = computed(() => props.showLikeButton || props.showCopyLink)
const videoSource = computed(() => resolveVideoSource(tweetData.value?.video))

function clearCopyTimeout() {
  if (copyTimeoutId.value !== null) {
    window.clearTimeout(copyTimeoutId.value)
    copyTimeoutId.value = null
  }
}

function resolveVideoSource(video?: TweetVideo | null) {
  if (!video?.variants?.length) {
    return null
  }

  const getResolution = (url: string) => {
    const match = url.match(/\/(\d+)x(\d+)\//)

    if (!match) {
      return 0
    }

    return Number(match[1]) * Number(match[2])
  }

  const mp4Variants = video.variants
    .filter((variant) => variant.type === 'video/mp4')
    .sort((left, right) => getResolution(right.src) - getResolution(left.src))

  if (mp4Variants.length > 0) {
    return mp4Variants[0]
  }

  return video.variants[0]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm} · ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function getPhotoGridClass(photoCount: number) {
  if (photoCount === 1) {
    return 'grid-cols-1'
  }

  return 'grid-cols-2'
}

async function copyLink() {
  if (!tweetData.value || !navigator.clipboard) {
    return
  }

  await navigator.clipboard.writeText(tweetData.value.url).catch(() => {})
  copied.value = true
  clearCopyTimeout()
  copyTimeoutId.value = window.setTimeout(() => {
    copied.value = false
    copyTimeoutId.value = null
  }, 1500)
}

async function loadTweet() {
  const currentRequest = ++requestId.value
  isLoading.value = true
  error.value = false
  copied.value = false
  clearCopyTimeout()

  try {
    const payload = await fetchTweet(props.id, props.apiUrl)

    if (currentRequest !== requestId.value) {
      return
    }

    tweet.value = payload
  } catch {
    if (currentRequest !== requestId.value) {
      return
    }

    tweet.value = null
    error.value = true
  } finally {
    if (currentRequest === requestId.value) {
      isLoading.value = false
    }
  }
}

watch(
  () => [props.id, props.apiUrl],
  () => {
    void loadTweet()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearCopyTimeout()
})
</script>

<template>
  <div
    v-if="isLoading"
    :class="
      cn(
        'block w-full max-w-[590px] rounded-xl p-4 dark:border dark:border-muted not-dark:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)]',
        props.class,
      )
    "
  >
    <div class="flex items-center gap-2">
      <div class="size-[38px] shrink-0 animate-pulse rounded-full bg-muted" />
      <div class="flex flex-col gap-1">
        <div class="h-4 w-24 animate-pulse rounded bg-muted" />
        <div class="h-3 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
    <div class="mt-4 space-y-2">
      <div class="h-4 w-full animate-pulse rounded bg-muted" />
      <div class="h-4 w-3/4 animate-pulse rounded bg-muted" />
    </div>
  </div>

  <div
    v-else-if="error || !tweetData"
    :class="
      cn(
        'flex w-full max-w-[590px] flex-col items-center justify-center gap-2 rounded-xl p-6 text-muted-foreground dark:border dark:border-muted not-dark:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)]',
        props.class,
      )
    "
  >
    <p class="text-sm">Tweet not found</p>
  </div>

  <div
    v-else
    :class="
      cn(
        'w-full max-w-[590px] rounded-xl p-4 dark:border dark:border-muted not-dark:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)]',
        props.class,
      )
    "
  >
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <img
          :src="tweetData.user.profile_image_url_https"
          :alt="tweetData.user.name"
          loading="lazy"
          width="38"
          height="38"
          class="rounded-full"
        />

        <div class="flex flex-col">
          <span class="flex items-center gap-1 text-[15px] font-semibold text-primary">
            {{ tweetData.user.name }}
            <svg
              v-if="tweetData.user.verified || tweetData.user.is_blue_verified"
              viewBox="0 0 22 22"
              class="size-4 text-[#1C9BF1]"
              fill="currentColor"
              aria-label="Verified account"
              role="img"
            >
              <path
                d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
              />
            </svg>
          </span>
          <span class="-mt-0.5 text-[13px] text-muted-foreground">@{{ tweetData.user.screen_name }}</span>
        </div>
      </div>

      <a :href="tweetData.url" target="_blank" rel="noopener noreferrer" aria-label="Open on X">
        <svg viewBox="0 0 24 24" class="size-5 fill-current">
          <path
            d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932zM17.61 20.645h2.039L6.486 3.24H4.298z"
          />
        </svg>
      </a>
    </div>

    <p class="mt-3 leading-6 text-primary">
      <template v-for="(entity, index) in tweetData.entities" :key="`${entity.type}-${index}`">
        <span v-if="entity.type === 'text'" v-html="entity.text" />
        <a
          v-else
          :href="entity.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[#1C9BF1] hover:underline"
        >
          {{ entity.text }}
        </a>
      </template>
    </p>

    <div v-if="tweetData.video && videoSource" class="mt-4">
      <video
        :poster="tweetData.video.poster"
        autoplay
        loop
        muted
        playsinline
        class="w-full rounded-lg"
      >
        <source :src="videoSource.src" :type="videoSource.type" />
      </video>
    </div>

    <div
      v-else-if="tweetData.photos?.length"
      class="mt-4 grid gap-1"
      :class="getPhotoGridClass(tweetData.photos.length)"
    >
      <img
        v-for="(photo, index) in tweetData.photos"
        :key="photo.url"
        :src="photo.url"
        :alt="`Photo ${index + 1}`"
        loading="lazy"
        :class="
          cn(
            'w-full rounded-lg object-cover',
            tweetData.photos.length === 3 && index === 0 && 'row-span-2',
          )
        "
      />
    </div>

    <div v-if="props.showDate" class="mt-4">
      <time class="text-sm text-muted-foreground" :dateTime="tweetData.created_at">
        {{ formatDate(tweetData.created_at) }}
      </time>
    </div>

    <div v-if="showActions" class="mt-2.5 flex gap-4 border-t border-muted pt-3.5">
      <a
        v-if="props.showLikeButton"
        :href="tweetData.like_url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 text-muted-foreground"
      >
        <svg
          class="text-pink-600"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g fill="currentColor">
            <path
              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
            />
          </g>
        </svg>
        <span class="text-sm text-medium transition-colors hover:text-pink-600">
          {{ formatTweetNumber(tweetData.favorite_count) }}
        </span>
      </a>

      <button
        v-if="props.showCopyLink"
        type="button"
        class="flex cursor-pointer items-center gap-1.5 text-muted-foreground"
        @click="copyLink"
      >
        <Check v-if="copied" class="size-4 text-emerald-500" />
        <Link2 v-else class="size-4" />
        <span class="text-sm text-medium">Copy link</span>
      </button>
    </div>
  </div>
</template>
