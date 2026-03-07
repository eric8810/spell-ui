<script setup lang="ts">
import { InfoIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { cn } from '@/lib/utils'

interface PropsTableItem {
  name: string
  nameDetails?: string
  type: string
  typeDetails?: string
  default?: string
  defaultDetails?: string
}

interface Props {
  data: PropsTableItem[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="!data.length" class="mt-6 flex h-[42px] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
    <div class="text-center text-sm text-muted-foreground">No Additional Props</div>
  </div>

  <div v-else class="mt-6 w-full overflow-x-scroll rounded-lg border border-border">
    <table class="not-prose w-full">
      <thead class="border-b border-border bg-muted/30 text-left">
        <tr>
          <th class="px-4 py-3 text-sm font-medium text-muted-foreground">Prop</th>
          <th class="px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
          <th class="px-4 py-3 text-sm font-medium text-muted-foreground">Default</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="item.name" :class="cn('text-left', index !== data.length - 1 && 'border-b border-border')">
          <td class="px-4 py-3">
            <div class="flex items-center gap-1">
              <code class="rounded-md bg-muted/75 px-2 py-0.5 font-mono text-sm text-neutral-600 dark:bg-muted/50 dark:text-neutral-300">{{ item.name }}</code>
              <Popover v-if="item.nameDetails">
                <PopoverTrigger as-child>
                  <button type="button" class="inline-flex items-center justify-center rounded-md p-1 transition-colors hover:bg-accent" aria-label="More information">
                    <InfoIcon class="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" class="w-auto max-w-96 px-3 py-1.5 text-sm leading-[18px] text-muted-foreground">
                  {{ item.nameDetails }}
                </PopoverContent>
              </Popover>
            </div>
          </td>
          <td class="px-4 py-3">
            <div v-if="item.type" class="flex items-center gap-1">
              <code class="rounded-md bg-muted/75 px-2 py-0.5 font-mono text-sm text-neutral-600 dark:bg-muted/50 dark:text-neutral-300">{{ item.type }}</code>
              <Popover v-if="item.typeDetails">
                <PopoverTrigger as-child>
                  <button type="button" class="inline-flex items-center justify-center rounded-md p-1 transition-colors hover:bg-accent" aria-label="More information">
                    <InfoIcon class="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" class="w-auto max-w-96 px-3 py-1.5 text-sm leading-[18px] text-muted-foreground">
                  {{ item.typeDetails }}
                </PopoverContent>
              </Popover>
            </div>
            <span v-else class="text-muted-foreground">-</span>
          </td>
          <td class="px-4 py-3">
            <div v-if="item.default" class="flex items-center gap-1">
              <code class="rounded-md bg-muted/75 px-2 py-0.5 font-mono text-sm text-neutral-600 dark:bg-muted/50 dark:text-neutral-300">{{ item.default }}</code>
              <Popover v-if="item.defaultDetails">
                <PopoverTrigger as-child>
                  <button type="button" class="inline-flex items-center justify-center rounded-md p-1 transition-colors hover:bg-accent" aria-label="More information">
                    <InfoIcon class="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" class="w-auto max-w-96 px-3 py-1.5 text-sm leading-[18px] text-muted-foreground">
                  {{ item.defaultDetails }}
                </PopoverContent>
              </Popover>
            </div>
            <span v-else class="text-muted-foreground">-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
