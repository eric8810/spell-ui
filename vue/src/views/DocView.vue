<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-vue-next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from '@/components/ui'
import DocsLayout from '@/layouts/DocsLayout.vue'
import DocCopySection from '@/components/docs/DocCopySection.vue'
import DocsTableOfContents from '@/components/docs/DocsTableOfContents.vue'
import ReactIsland from '@/components/docs/ReactIsland.vue'
import { allDocItems, getDocById, getDocSchema } from '@/lib/doc'
import { getTableOfContents } from '@/lib/toc'
import { navigate, routeSection, useRoute } from '@/router'
import type { TocItem } from '@/lib/types'
import { ref } from 'vue'

const route = useRoute()
const docSchema = getDocSchema()
const allDocs = allDocItems()

const doc = computed(() => (route.value.name === 'doc' ? getDocById(route.value.id) : null))
const docId = computed(() => (route.value.name === 'doc' ? route.value.id : null))
const currentIndex = computed(() => allDocs.findIndex((item) => item.id === docId.value))
const prevDoc = computed(() => (currentIndex.value > 0 ? allDocs[currentIndex.value - 1] : null))
const nextDoc = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < allDocs.length - 1 ? allDocs[currentIndex.value + 1] : null,
)
const gettingStartedIds = new Set(docSchema[0]?.items.map((item) => item.id) ?? [])
const isGettingStarted = computed(() => (docId.value ? gettingStartedIds.has(docId.value) : false))

const docComponent = ref<any>(null)
const rawContent = ref('')
const toc = ref<TocItem[]>([])

const waitForSectionElement = async (section: string) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await nextTick()

    const element = document.getElementById(section)
    if (element) {
      return element
    }

    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
  }

  return null
}

const scrollToCurrentSection = async () => {
  const section = routeSection.value

  if (!section || typeof window === 'undefined') {
    return
  }

  const element = await waitForSectionElement(section)
  element?.scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  })
}

watch(
  () => docId.value,
  async (id) => {
    docComponent.value = null
    rawContent.value = ''
    toc.value = []

    if (!id) {
      return
    }

    const { docModuleLoaders, docSourceLoaders } = await import('@/generated/manifest.js')
    const moduleLoader = docModuleLoaders[id]
    const sourceLoader = docSourceLoaders[id]

    if (!moduleLoader || !sourceLoader) {
      return
    }

    const [module, sourceModule] = await Promise.all([moduleLoader(), sourceLoader()])
    docComponent.value = module
    rawContent.value = sourceModule.default ?? ''
    toc.value = await getTableOfContents(rawContent.value)

    await scrollToCurrentSection()
  },
  { immediate: true },
)

watch(
  () => routeSection.value,
  () => {
    void scrollToCurrentSection()
  },
)
</script>

<template>
  <DocsLayout :doc-schema="docSchema">
    <div v-if="doc" class="container py-8 md:py-12">
      <div class="mx-auto max-w-[1600px] xl:grid xl:grid-cols-[10px_1fr_200px] xl:gap-8 lg:grid-cols-[0px_1fr_200px]">
        <div class="hidden xl:block" />
        <article class="prose w-full max-w-4xl dark:prose-invert">
          <header class="not-prose mb-8">
            <Breadcrumb class="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs/introduction" @click.prevent="navigate('/docs/introduction')">
                    Docs
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <template v-if="isGettingStarted">
                  <BreadcrumbItem>
                    <BreadcrumbPage>{{ doc.title }}</BreadcrumbPage>
                  </BreadcrumbItem>
                </template>
                <template v-else>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/docs/components" @click.prevent="navigate('/docs/components')">
                      Components
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{{ doc.title }}</BreadcrumbPage>
                  </BreadcrumbItem>
                </template>
              </BreadcrumbList>
            </Breadcrumb>

            <div class="flex items-start justify-between gap-4">
              <div class="space-y-2">
                <h1 class="scroll-m-20 text-3xl font-semibold tracking-tighter">
                  {{ doc.title }}
                </h1>
                <p class="text-base text-muted-foreground">
                  {{ doc.description }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <DocCopySection :content="rawContent" :url="`/docs/${doc.id}`" />
                <Button
                  variant="secondary"
                  size="icon"
                  class="size-8 rounded-full shadow-none"
                  :disabled="!prevDoc"
                  @click="prevDoc && navigate(`/docs/${prevDoc.id}`)"
                >
                  <ArrowLeft class="text-muted-foreground" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  class="size-8 rounded-full shadow-none"
                  :disabled="!nextDoc"
                  @click="nextDoc && navigate(`/docs/${nextDoc.id}`)"
                >
                  <ArrowRight class="text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div v-if="doc.meta?.docs?.length" class="flex items-center gap-2 pt-4">
              <a
                v-for="externalDoc in doc.meta.docs"
                :key="externalDoc.title"
                :href="externalDoc.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
              >
                {{ externalDoc.title }}
                <ExternalLink class="size-4" />
              </a>
            </div>
          </header>

          <ReactIsland v-if="docComponent" :component="docComponent" mode="mdx" />

          <nav class="not-prose mt-12 flex items-center justify-between border-t pt-12">
            <button
              v-if="prevDoc"
              type="button"
              class="group flex max-w-40 flex-col items-start gap-1 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              @click="navigate(`/docs/${prevDoc.id}`)"
            >
              <span class="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">Previous</span>
              <span class="truncate">{{ prevDoc.title }}</span>
            </button>
            <div v-else />
            <button
              v-if="nextDoc"
              type="button"
              class="group flex max-w-40 flex-col items-end gap-1 text-right text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              @click="navigate(`/docs/${nextDoc.id}`)"
            >
              <span class="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">Next</span>
              <span class="truncate">{{ nextDoc.title }}</span>
            </button>
            <div v-else />
          </nav>
        </article>

        <aside class="hidden h-fit xl:block sticky top-[90px]">
          <DocsTableOfContents :toc="toc" :doc-id="doc.id" />
        </aside>
      </div>
    </div>
  </DocsLayout>
</template>
