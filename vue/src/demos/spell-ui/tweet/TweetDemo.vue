<script setup lang="ts">
import { Check, Link2 } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'

interface Props {
  id?: string
}

interface SyndicationTweet {
  id_str: string
  created_at: string
  text?: string
  favorite_count: number
  user: {
    name: string
    screen_name: string
    profile_image_url_https: string
    verified?: boolean
    is_blue_verified?: boolean
  }
  url: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '1994155465488670828',
})

const loading = ref(true)
const copied = ref(false)
const tweet = ref<SyndicationTweet | null>(null)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).replace(',', ' ·')
}

const formattedText = computed(() =>
  (tweet.value?.text ?? '')
    .replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#1C9BF1] hover:underline">$1</a>')
    .replace(/(@[A-Za-z0-9_]+)/g, '<span class="text-[#1C9BF1]">$1</span>')
    .replace(/(#[A-Za-z0-9_]+)/g, '<span class="text-[#1C9BF1]">$1</span>'),
)

const copyLink = async () => {
  if (!tweet.value) {
    return
  }

  await navigator.clipboard.writeText(tweet.value.url)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}

onMounted(async () => {
  try {
    const response = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${props.id}&lang=en`)
    if (!response.ok) {
      throw new Error('Failed to load tweet')
    }

    const data = await response.json()
    tweet.value = {
      id_str: data.id_str,
      created_at: data.created_at,
      text: data.text,
      favorite_count: data.favorite_count ?? 0,
      user: data.user,
      url: `https://x.com/${data.user?.screen_name}/status/${data.id_str}`,
    }
  } catch {
    tweet.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="block w-full max-w-[590px] rounded-xl p-4 dark:border dark:border-muted not-dark:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)]">
    <div class="flex items-center gap-2">
      <div class="size-[38px] animate-pulse rounded-full bg-muted" />
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

  <div v-else-if="tweet" class="w-full max-w-[590px] rounded-xl p-4 dark:border dark:border-muted not-dark:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)]">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <img :src="tweet.user.profile_image_url_https" :alt="tweet.user.name" width="38" height="38" class="rounded-full">
        <div class="flex flex-col">
          <span class="flex items-center gap-1 text-[15px] font-semibold text-primary">
            {{ tweet.user.name }}
            <svg v-if="tweet.user.verified || tweet.user.is_blue_verified" viewBox="0 0 22 22" class="size-4 text-[#1C9BF1]" fill="currentColor">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
          </span>
          <span class="-mt-0.5 text-[13px] text-muted-foreground">@{{ tweet.user.screen_name }}</span>
        </div>
      </div>
      <a :href="tweet.url" target="_blank" rel="noopener noreferrer" aria-label="Open on X">
        <svg viewBox="0 0 24 24" class="size-5 fill-current">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932zM17.61 20.645h2.039L6.486 3.24H4.298z" />
        </svg>
      </a>
    </div>

    <p class="mt-3 leading-6 text-primary" v-html="formattedText" />

    <div class="mt-4">
      <time class="text-sm text-muted-foreground" :dateTime="tweet.created_at">{{ formatDate(tweet.created_at) }}</time>
    </div>
    <div class="mt-2.5 flex gap-4 border-t border-muted pt-3.5">
      <a :href="`https://x.com/intent/like?tweet_id=${tweet.id_str}`" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-muted-foreground">
        <svg class="text-pink-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M12.164 2c-1.195.015-2.324.49-3.164 1.306-.84-.815-1.972-1.291-3.178-1.306-2.53.015-4.582 2.084-4.572 4.609 0 5.253 5.306 8.429 6.932 9.278.256.133.537.2.818.2s.562-.067.817-.2c1.626-.848 6.933-4.024 6.933-9.275.009-2.528-2.042-4.597-4.586-4.612Z" fill="currentColor"/></svg>
        <span class="text-sm">{{ tweet.favorite_count }}</span>
      </a>
      <button type="button" class="flex cursor-pointer items-center gap-1.5 text-muted-foreground" @click="copyLink">
        <Check v-if="copied" class="size-4 text-emerald-500" />
        <Link2 v-else class="size-4" />
        <span class="text-sm">Copy link</span>
      </button>
    </div>
  </div>

  <div v-else class="flex w-full max-w-[590px] flex-col items-center justify-center gap-2 rounded-xl p-6 text-muted-foreground dark:border dark:border-muted not-dark:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)]">
    <p class="text-sm">Tweet not found</p>
  </div>
</template>
