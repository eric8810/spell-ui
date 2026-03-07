<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui'
import { navigate, useRoute } from '@/router'
import { useSidebar } from '@/composables/useSidebar'
import type { DocSchema } from '@/lib/types'

const props = defineProps<{
  docSchema: DocSchema
}>()

const route = useRoute()
const { isMobile, toggleSidebar } = useSidebar()

const goToDoc = (id: string) => {
  navigate(`/docs/${id}`)
  if (isMobile.value) {
    toggleSidebar()
  }
}
</script>

<template>
  <Sidebar class="mt-14">
    <SidebarContent
      class="max-h-[calc(100vh-100px)] overflow-y-auto"
      style="mask-image: linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.2) 1rem, black 2rem, black calc(100% - 2rem), rgba(0,0,0,0.2) calc(100% - 1rem), transparent 100%);"
    >
      <div class="h-4 shrink-0" />
      <SidebarGroup v-for="group in props.docSchema" :key="group.title">
        <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.id">
              <SidebarMenuButton
                class="data-[active=true]:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)] data-[active=true]:not-dark:bg-white transition-all"
                :is-active="route.name === 'doc' && route.id === item.id"
                @click="goToDoc(item.id)"
              >
                <span>{{ item.title }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div class="h-4 shrink-0" />
    </SidebarContent>
  </Sidebar>
</template>
