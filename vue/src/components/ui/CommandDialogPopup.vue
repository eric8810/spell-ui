<script setup lang="ts">
import { DialogContent } from 'radix-vue'
import { cn } from '@/lib/utils'
import CommandDialogBackdrop from './CommandDialogBackdrop.vue'
import CommandDialogPortal from './CommandDialogPortal.vue'
import CommandDialogViewport from './CommandDialogViewport.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <CommandDialogPortal>
    <CommandDialogBackdrop />
    <CommandDialogViewport>
      <DialogContent
        data-slot="command-dialog-popup"
        :class="cn(
          'relative flex max-h-105 min-h-0 w-full min-w-0 max-w-xl flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-hidden transition-[transform,opacity] duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:bg-muted/72 before:shadow-[0_1px_--theme(--color-black/6%)] data-[state=closed]:scale-98 data-[state=closed]:opacity-0 data-[state=open]:animate-in dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
          props.class
        )"
        v-bind="$attrs"
      >
        <slot />
      </DialogContent>
    </CommandDialogViewport>
  </CommandDialogPortal>
</template>
