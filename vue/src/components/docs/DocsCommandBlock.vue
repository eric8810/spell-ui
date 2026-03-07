<script setup lang="ts">
import { Check, Copy, Terminal } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Props {
  item?: string
  mcp?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  item: '',
  mcp: false,
  class: '',
})

const STORAGE_KEY = 'spell-ui-config'
const packageManager = ref<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm')
const copied = ref(false)

const commands = computed(() => {
  if (props.mcp) {
    return {
      pnpm: 'pnpm dlx shadcn@latest mcp init',
      npm: 'npx shadcn@latest mcp init',
      yarn: 'yarn dlx shadcn@latest mcp init',
      bun: 'bunx --bun shadcn@latest mcp init',
    }
  }

  return {
    pnpm: `pnpm dlx shadcn@latest add "https://spell.sh/r/${props.item}.json"`,
    npm: `npx shadcn@latest add "https://spell.sh/r/${props.item}.json"`,
    yarn: `yarn dlx shadcn@latest add "https://spell.sh/r/${props.item}.json"`,
    bun: `bunx --bun shadcn@latest add "https://spell.sh/r/${props.item}.json"`,
  }
})

const copyCommand = async () => {
  await navigator.clipboard.writeText(commands.value[packageManager.value])
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}

onMounted(() => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return
    }

    const parsed = JSON.parse(stored)
    if (parsed?.packageManager && parsed.packageManager in commands.value) {
      packageManager.value = parsed.packageManager
    }
  } catch {
  }
})

watch(packageManager, (value) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ packageManager: value }))
})
</script>

<template>
  <div :class="cn('relative overflow-hidden rounded-md border bg-muted/30', props.class)">
    <Tabs v-model="packageManager" class="gap-0">
      <div class="relative flex items-center gap-2 border-b bg-background/50 px-4 py-2.5">
        <Terminal class="size-3.5 text-muted-foreground" :stroke-width="2" />
        <TabsList class="h-auto bg-transparent p-0" translate="no">
          <TabsTrigger v-for="name in ['pnpm', 'npm', 'yarn', 'bun']" :key="name" :value="name" class="h-auto rounded-sm px-2 py-1 font-mono text-xs data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-background">
            {{ name }}
          </TabsTrigger>
        </TabsList>
        <Button size="icon" variant="ghost" class="absolute right-2 size-7 cursor-pointer opacity-70 hover:bg-transparent dark:hover:bg-transparent" @click="copyCommand">
          <span class="sr-only">Copy</span>
          <Check v-if="copied" class="size-3.5 text-emerald-600" :stroke-width="2" />
          <Copy v-else class="size-3.5" :stroke-width="2" />
        </Button>
      </div>
      <div class="bg-background">
        <TabsContent v-for="(command, key) in commands" :key="key" :value="key" class="m-0">
          <pre class="not-prose overflow-x-auto px-4 py-3 dark:bg-[#0F0F0F]"><code class="font-mono text-sm text-[#032F62] dark:text-[#9ECBFF]">{{ command }}</code></pre>
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>
