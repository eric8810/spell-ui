<script setup lang="ts">
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui'
import SiteHeader from '@/components/docs/SiteHeader.vue'
import AppSidebar from '@/components/docs/AppSidebar.vue'
import type { DocSchema } from '@/lib/types'

defineProps<{
  docSchema: DocSchema
}>()
</script>

<template>
  <div class="flex">
    <SidebarProvider class="flex flex-col">
      <SiteHeader :doc-schema="docSchema" />
      <div class="mx-auto flex w-full items-start pt-14 3xl:max-w-screen-2xl">
        <AppSidebar :doc-schema="docSchema" />
        <SidebarInset>
          <slot />
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
</template>
