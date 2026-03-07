<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Github } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { siteConfig } from '@/lib/config'

const COOKIE_NAME = 'github-stars'
const ONE_HOUR = 60 * 60 * 1000
const stars = ref('0')

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null
  }
  return null
}

const setCookie = (name: string, value: string) => {
  const expires = new Date(Date.now() + ONE_HOUR).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

onMounted(async () => {
  const cached = getCookie(COOKIE_NAME)
  if (cached) {
    stars.value = cached
    return
  }

  try {
    const repoPath = siteConfig.links.github.replace('https://github.com/', '')
    const response = await fetch(`https://api.github.com/repos/${repoPath}`)
    if (!response.ok) {
      setCookie(COOKIE_NAME, '0')
      return
    }

    const payload = (await response.json()) as { stargazers_count?: number }
    const count = payload.stargazers_count ?? 0
    const display = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`
    stars.value = display
    setCookie(COOKIE_NAME, display)
  } catch {
    setCookie(COOKIE_NAME, '0')
  }
})
</script>

<template>
  <Button variant="outline" class="h-8 px-3 shadow-none dark:bg-background dark:hover:bg-input/20" as-child>
    <a :href="siteConfig.links.github" target="_blank" rel="noopener noreferrer">
      <Github class="size-4" />
      {{ stars }}
      <span class="sr-only">Open Github</span>
    </a>
  </Button>
</template>
