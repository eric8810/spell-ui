<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import DocsCodeBlock from '@/components/docs/DocsCodeBlock.vue'
import DocsCommandBlock from '@/components/docs/DocsCommandBlock.vue'

interface Props {
  item: string
  html: string
}

defineProps<Props>()
</script>

<template>
  <Tabs default-value="cli" class="w-full">
    <TabsList class="not-prose bg-transparent">
      <TabsTrigger value="cli" class="rounded-md px-2 text-center data-[state=active]:bg-white data-[state=active]:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)] data-[state=active]:dark:bg-[#0B0B09]">
        CLI
      </TabsTrigger>
      <TabsTrigger value="manual" class="rounded-md px-2 text-center data-[state=active]:bg-white data-[state=active]:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)] data-[state=active]:dark:bg-[#0B0B09]">
        Manual
      </TabsTrigger>
    </TabsList>

    <TabsContent value="cli">
      <DocsCommandBlock :item="item" />
    </TabsContent>

    <TabsContent value="manual" class="[&_pre]:my-0">
      <DocsCodeBlock :html="html" />
    </TabsContent>
  </Tabs>
</template>
