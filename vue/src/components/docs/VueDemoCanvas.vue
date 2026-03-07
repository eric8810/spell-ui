<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import DocsCodeBlock from '@/components/docs/DocsCodeBlock.vue'
import OpenInV0Button from '@/components/docs/OpenInV0Button.vue'
import RefreshAnticlockwise from '@/components/docs/icons/RefreshAnticlockwise.vue'
import { cn } from '@/lib/utils'

interface Props {
  demoPath: string
  demoProps?: Record<string, unknown>
  previewClass?: string
  codeHtml: string
  docId?: string
}

const props = withDefaults(defineProps<Props>(), {
  demoProps: () => ({}),
  previewClass: '',
  docId: '',
})

const demoComponent = shallowRef<any>(null)
const renderKey = ref(0)
const rotating = ref(false)

const previewClassName = computed(() =>
  cn(
    'preview not-prose flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-sm border p-10 md:min-h-80',
    props.previewClass,
  ),
)

const refresh = () => {
  rotating.value = true
  renderKey.value += 1
  window.setTimeout(() => {
    rotating.value = false
  }, 500)
}

watch(
  () => props.demoPath,
  async (path) => {
    demoComponent.value = null

    const { demoModuleLoaders } = await import('@/generated/manifest.js')
    const loader = demoModuleLoaders[path]

    if (!loader) {
      return
    }

    const module = await loader()
    demoComponent.value = module.default ?? module
  },
  { immediate: true },
)
</script>

<template>
  <Tabs default-value="preview">
    <div class="not-prose flex items-center justify-between">
      <TabsList class="bg-transparent">
        <TabsTrigger value="preview" class="cursor-pointer rounded-md px-2 text-center data-[state=active]:bg-white data-[state=active]:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)] data-[state=active]:dark:bg-[#0B0B09]">
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" class="cursor-pointer rounded-md px-2 text-center data-[state=active]:bg-white data-[state=active]:shadow-[0_0_0_1px_rgba(0,0,0,.08),_0px_2px_2px_rgba(0,0,0,.04)] data-[state=active]:dark:bg-[#0B0B09]">
          Code
        </TabsTrigger>
      </TabsList>

      <div class="flex items-center gap-1">
        <OpenInV0Button v-if="props.docId" :id="props.docId" />
        <button type="button" class="cursor-pointer rounded-md p-1.5 hover:bg-muted" title="Refresh component" @click="refresh">
          <RefreshAnticlockwise :class="cn('h-4 w-4 transition-transform duration-500', rotating && 'rotate-180')" />
        </button>
      </div>
    </div>

    <div :key="renderKey">
      <TabsContent value="preview">
        <div :class="previewClassName">
          <component :is="demoComponent" v-if="demoComponent" v-bind="props.demoProps" />
          <Spinner v-else size="md" />
        </div>
      </TabsContent>

      <TabsContent value="code" class="[&_pre]:my-0">
        <DocsCodeBlock :html="props.codeHtml" />
      </TabsContent>
    </div>
  </Tabs>
</template>
