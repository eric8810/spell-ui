<template>
  <Tooltip v-if="tooltip">
    <TooltipTrigger as-child>
      <button
        v-if="!asChild"
        data-slot="sidebar-menu-button"
        data-sidebar="menu-button"
        :data-size="size"
        :data-active="isActive"
        :class="cn(sidebarMenuButtonVariants({ variant, size }), attrs.class as string)"
        v-bind="buttonAttrs"
      >
        <slot />
      </button>
      <slot v-else />
    </TooltipTrigger>
    <TooltipContent
      side="right"
      align="center"
      :hidden="sidebarContext.state.value !== 'collapsed' || sidebarContext.isMobile.value"
    >
      {{ typeof tooltip === 'string' ? tooltip : tooltip.children }}
    </TooltipContent>
  </Tooltip>
  <template v-else>
    <button
      v-if="!asChild"
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      :data-size="size"
      :data-active="isActive"
      :class="cn(sidebarMenuButtonVariants({ variant, size }), attrs.class as string)"
      v-bind="buttonAttrs"
    >
      <slot />
    </button>
    <slot v-else />
  </template>
</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/composables/useSidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '.'
import { cva, type VariantProps } from 'class-variance-authority'

const attrs = useAttrs()

// 排除 class，只传递事件和其他属性
const buttonAttrs = computed(() => {
  const { class: _, ...rest } = attrs
  return rest
})

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-[450] outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline: 'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]'
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type SidebarMenuButtonVariants = VariantProps<typeof sidebarMenuButtonVariants>

interface Props {
  asChild?: boolean
  isActive?: boolean
  variant?: SidebarMenuButtonVariants['variant']
  size?: SidebarMenuButtonVariants['size']
  tooltip?: string | { children: string }
}

withDefaults(defineProps<Props>(), {
  asChild: false,
  isActive: false,
  variant: 'default',
  size: 'default'
})

const sidebarContext = useSidebar()

defineOptions({
  inheritAttrs: false
})
</script>
