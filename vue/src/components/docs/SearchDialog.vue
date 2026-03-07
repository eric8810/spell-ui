<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { CornerDownLeft, Search } from 'lucide-vue-next'
import { Button, Dialog, DialogContent, Input, ScrollArea } from '@/components/ui'
import { cn } from '@/lib/utils'
import { navigate } from '@/router'
import type { DocSchema } from '@/lib/types'

const props = defineProps<{
  docSchema: DocSchema
}>()

const open = ref(false)
const query = ref('')

const groups = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) {
    return props.docSchema
  }

  return props.docSchema
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const haystack = `${item.title} ${item.description}`.toLowerCase()
        return haystack.includes(keyword)
      }),
    }))
    .filter((group) => group.items.length > 0)
})

const handleGlobalKey = (event: KeyboardEvent) => {
  const target = event.target
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  ) {
    return
  }

  if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || event.key === '/') {
    event.preventDefault()
    open.value = !open.value
  }
}

const goToDoc = (id: string) => {
  open.value = false
  query.value = ''
  navigate(`/docs/${id}`)
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKey)
})
</script>

<template>
  <Button
    variant="outline"
    size="sm"
    class="hidden cursor-text items-center gap-2 text-sm text-muted-foreground shadow-none dark:bg-background dark:hover:bg-input/20 sm:inline-flex"
    @click="open = true"
  >
    <Search class="size-4" />
    <span class="pr-8">Search documentation...</span>
    <kbd class="-me-1 grid min-h-5 min-w-5 place-content-center rounded text-xs font-normal text-foreground shadow-[0_0_0_1px_var(--input)]">
      /
    </kbd>
  </Button>

  <Dialog :open="open" @update:open="open = $event">
    <DialogContent class="max-w-2xl gap-0 overflow-hidden p-0">
      <div class="border-b p-4">
        <Input v-model="query" type="search" placeholder="Type a command or search..." />
      </div>

      <ScrollArea class="max-h-[28rem]">
        <div class="p-2">
          <template v-if="groups.length">
            <div v-for="group in groups" :key="group.title" class="pb-2">
              <div class="px-2 pb-2 pt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {{ group.title }}
              </div>
              <button
                v-for="item in group.items"
                :key="item.id"
                type="button"
                class="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
                @click="goToDoc(item.id)"
              >
                <div class="flex-1">
                  <div class="font-medium text-foreground">{{ item.title }}</div>
                  <div class="line-clamp-2 text-sm text-muted-foreground">{{ item.description }}</div>
                </div>
                <CornerDownLeft class="mt-0.5 size-4 text-muted-foreground" />
              </button>
            </div>
          </template>
          <div v-else class="px-4 py-10 text-center text-sm text-muted-foreground">
            The search results could not be found.
          </div>
        </div>
      </ScrollArea>

      <div
        :class="cn('flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground')"
      >
        <div class="flex items-center gap-1.5">
          <span>Go to Page</span>
          <kbd class="grid min-h-4 place-content-center rounded px-1 font-normal shadow-[0_0_0_1px_var(--border)]">
            <CornerDownLeft class="size-2.5" />
          </kbd>
        </div>
        <div class="flex items-center gap-2">
          <span class="grid min-h-4 place-content-center rounded px-1 shadow-[0_0_0_1px_var(--border)]">Esc</span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
