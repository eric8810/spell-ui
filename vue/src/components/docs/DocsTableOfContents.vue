<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { List, SquarePen } from 'lucide-vue-next'
import { Separator } from '@/components/ui'
import { siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'
import type { TocItem } from '@/lib/types'

const props = defineProps<{
  toc: TocItem[]
  docId?: string
  class?: string
}>()

const activeHeading = ref<string | null>(null)
let observer: IntersectionObserver | null = null

const itemIds = computed(() => props.toc.map((item) => item.url.replace('#', '')))

const connectObserver = () => {
  observer?.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeHeading.value = entry.target.id
        }
      }
    },
    { rootMargin: '0% 0% -80% 0%' },
  )

  for (const id of itemIds.value) {
    const element = document.getElementById(id)
    if (element) {
      observer.observe(element)
    }
  }
}

watch(itemIds, connectObserver)

onMounted(connectObserver)

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div v-if="props.toc.length" :class="cn('flex flex-col gap-2 p-4 pt-0 text-sm', props.class)">
    <p class="sticky top-0 mb-2 flex h-6 items-center gap-1.5 bg-background text-[0.85rem] text-primary">
      <List class="size-4" />
      On This Page
    </p>

    <a
      v-for="item in props.toc"
      :key="item.url"
      :href="item.url"
      :class="
        cn(
          'text-[0.9rem] text-muted-foreground no-underline transition-colors hover:text-foreground',
          item.url === `#${activeHeading}` && 'font-medium text-foreground',
          item.depth === 3 && 'pl-4',
          item.depth >= 4 && 'pl-6',
        )
      "
    >
      {{ item.title }}
    </a>

    <Separator orientation="horizontal" class="my-2" />

    <div class="flex flex-col gap-2">
      <a
        v-if="props.docId"
        :href="`${siteConfig.links.github}/edit/main/docs/${props.docId}/doc.mdx`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <SquarePen class="size-3" />
        Edit this page
      </a>
      <a
        :href="siteConfig.links.tom"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        Follow @tomm_ui
      </a>
    </div>
  </div>
</template>
