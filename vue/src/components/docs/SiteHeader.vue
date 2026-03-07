<script setup lang="ts">
import { computed, ref } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import AppLink from '@/components/AppLink.vue'
import GithubStars from './GithubStars.vue'
import MobileNav from './MobileNav.vue'
import SearchDialog from './SearchDialog.vue'
import SpellLogo from './SpellLogo.vue'
import { getStoredTheme, toggleStoredTheme } from '@/composables/useTheme'
import type { DocSchema } from '@/lib/types'

const props = defineProps<{
  docSchema: DocSchema
}>()

const theme = ref(getStoredTheme())
const isDark = computed(() => theme.value === 'dark')

const handleThemeToggle = () => {
  toggleStoredTheme()
  theme.value = getStoredTheme()
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background">
    <div class="mx-auto flex h-14 w-full items-center justify-between gap-4 px-4 3xl:max-w-screen-2xl">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <MobileNav :doc-schema="props.docSchema" class="md:hidden" />
          <AppLink to="/" class="flex items-center gap-1.5">
            <SpellLogo :size="24" />
            <h1 class="hidden font-medium md:inline" translate="no">Spell UI</h1>
          </AppLink>
        </div>
        <nav class="hidden items-center gap-4 text-sm md:flex md:gap-6">
          <AppLink to="/docs/introduction" class="text-muted-foreground transition-colors hover:text-foreground">
            Docs
          </AppLink>
          <AppLink to="/docs/components" class="text-muted-foreground transition-colors hover:text-foreground">
            Components
          </AppLink>
          <AppLink to="/docs/mcp" class="text-muted-foreground transition-colors hover:text-foreground">
            MCP
          </AppLink>
          <span class="pointer-events-none text-muted-foreground/50" aria-disabled="true">Sponsor</span>
        </nav>
      </div>

      <div class="flex gap-2 lg:gap-3">
        <SearchDialog :doc-schema="props.docSchema" />
        <GithubStars />
        <Button
          variant="outline"
          size="icon"
          class="relative size-8 rounded-full shadow-none dark:bg-background dark:hover:bg-input/20"
          @click="handleThemeToggle"
        >
          <Sun :class="['size-4 transition-all', isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100']" />
          <Moon
            :class="[
              'absolute size-4 transition-all',
              isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0',
            ]"
          />
          <span class="sr-only">Switch Theme</span>
        </Button>
      </div>
    </div>
  </header>
</template>
