<script setup lang="ts">
import { ref } from 'vue'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { cn } from '@/lib/utils'
import AppLink from '@/components/AppLink.vue'
import type { DocSchema } from '@/lib/types'

defineProps<{
  docSchema: DocSchema
  class?: string
}>()

const open = ref(false)
</script>

<template>
  <Popover :open="open" @update:open="open = $event">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        :class="
          cn(
            'h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent',
            $props.class,
          )
        "
      >
        <div class="relative flex h-8 w-4 items-center justify-center">
          <div class="relative size-4">
            <span
              :class="
                cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  open ? 'top-[0.45rem] -rotate-45' : 'top-1',
                )
              "
            />
            <span
              :class="
                cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  open ? 'top-[0.45rem] rotate-45' : 'top-2.5',
                )
              "
            />
          </div>
          <span class="sr-only">Toggle Menu</span>
        </div>
      </Button>
    </PopoverTrigger>

    <PopoverContent
      class="bg-background/90 h-(--radix-popover-content-available-height) w-(--radix-popover-content-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
      align="start"
      side="bottom"
      :align-offset="-16"
      :side-offset="14"
    >
      <div class="flex flex-col gap-12 overflow-auto px-4 py-6">
        <div class="flex flex-col gap-8">
          <div v-for="group in docSchema" :key="group.title" class="flex flex-col gap-4">
            <div class="text-sm font-medium text-muted-foreground">
              {{ group.title }}
            </div>
            <div class="flex flex-col gap-3">
              <AppLink
                v-for="item in group.items"
                :key="item.id"
                :to="`/docs/${item.id}`"
                class="text-2xl font-medium transition-colors"
                @click="open = false"
              >
                {{ item.title }}
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
