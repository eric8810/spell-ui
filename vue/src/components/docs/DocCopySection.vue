<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronDown, Copy } from 'lucide-vue-next'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  content: string
  url: string
}>()

const copied = ref(false)

const pathname = computed(() => {
  try {
    return new URL(props.url).pathname
  } catch {
    return props.url
  }
})

const promptUrl = (baseUrl: string) =>
  `${baseUrl}?q=${encodeURIComponent(
    `I'm looking at this spell ui documentation: https://spell.sh${props.url}.\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`,
  )}`

const copyPage = async () => {
  await navigator.clipboard.writeText(props.content)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}

const menuItems = computed(() => [
  {
    label: 'View as Markdown',
    href: `${pathname.value}.md`,
  },
  {
    label: 'Open in v0',
    href: promptUrl('https://v0.dev'),
  },
  {
    label: 'Open in ChatGPT',
    href: promptUrl('https://chatgpt.com'),
  },
  {
    label: 'Open in Claude',
    href: promptUrl('https://claude.ai/new'),
  },
])

const openItem = (href: string) => {
  window.open(href, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="hidden md:inline-flex -space-x-px rounded-full rtl:space-x-reverse">
    <Button
      class="relative rounded-none border-r-1 shadow-none first:rounded-s-md last:rounded-e-md"
      variant="secondary"
      size="sm"
      @click="copyPage"
    >
      <div class="flex items-center gap-2">
        <div class="relative h-4 w-4">
          <div
            :class="
              cn(
                'absolute inset-0 flex items-center justify-center transition-all duration-200',
                copied ? 'scale-100 opacity-100 blur-none' : 'scale-70 opacity-0 blur-[2px]',
              )
            "
          >
            <Check class="h-4 w-4 text-emerald-500" />
          </div>
          <div
            :class="
              cn(
                'absolute inset-0 flex items-center justify-center transition-all duration-200',
                copied ? 'scale-0 opacity-0 blur-[2px]' : 'scale-100 opacity-100 blur-none',
              )
            "
          >
            <Copy class="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <span>Copy this page</span>
      </div>
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button class="size-8 rounded-l-none shadow-none" variant="secondary" size="icon">
          <ChevronDown class="size-4" />
          <span class="sr-only">Open options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-48">
        <DropdownMenuItem
          v-for="item in menuItems"
          :key="item.label"
          @select="openItem(item.href)"
        >
          {{ item.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
