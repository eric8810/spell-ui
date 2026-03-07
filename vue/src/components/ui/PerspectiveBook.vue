<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type SizeVariant = 'sm' | 'default' | 'lg'

interface Props {
  size?: SizeVariant
  class?: string
  textured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  class: '',
  textured: false,
})

const sizeMap: Record<SizeVariant, { width: string; spineTranslation: string }> = {
  sm: { width: '150px', spineTranslation: '122px' },
  default: { width: '196px', spineTranslation: '168px' },
  lg: { width: '300px', spineTranslation: '272px' },
}

const defaultColorClasses =
  'bg-neutral-100 dark:bg-[#1f1f1f] dark:before:content-[""] dark:before:bg-gradient-to-b dark:before:from-[#ffffff1a] dark:before:to-transparent dark:before:absolute dark:before:inset-0 dark:before:rounded-[inherit] text-primary'

const surfaceClass = computed(() => props.class || defaultColorClasses)
const bookSize = computed(() => sizeMap[props.size])
const texturedOverlayStyle = computed(() => ({
  borderRadius: '6px 4px 4px 6px',
  backgroundImage: [
    'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))',
    'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.18), transparent 32%)',
    'radial-gradient(circle at 82% 28%, rgba(255,255,255,0.12), transparent 26%)',
    'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 4px)',
  ].join(', '),
}))
</script>

<template>
  <div class="z-10 group h-min w-min [perspective:900px]">
    <div
      class="relative aspect-[49/60] transition-transform duration-300 ease-out [transform-style:preserve-3d] [transform:rotateY(0deg)] group-hover:-translate-x-1 group-hover:scale-[1.066] group-hover:[transform:rotateY(-20deg)]"
      :style="{
        width: bookSize.width,
        borderRadius: '6px 4px 4px 6px',
      }"
    >
      <div
        :class="
          cn(
            'absolute inset-y-0 left-0 flex size-full flex-col overflow-hidden p-[12%] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-solid after:border-[#00000014] after:shadow-[0_1.8px_3.6px_#0000000d,_0_10.8px_21.6px_#00000014,_inset_0_-.9px_#0000001a,_inset_0_1.8px_1.8px_#ffffff1a,_inset_3.6px_0_3.6px_#0000001a]',
            surfaceClass,
          )
        "
        :style="{
          transform: 'translateZ(25px)',
          borderRadius: '6px 4px 4px 6px',
        }"
      >
        <div
          class="absolute left-0 top-0 h-full opacity-40"
          :style="{
            minWidth: '8.2%',
            background:
              'linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0) 12%, hsla(0, 0%, 100%, .25) 29.25%, hsla(0, 0%, 100%, 0) 50.5%, hsla(0, 0%, 100%, 0) 75.25%, hsla(0, 0%, 100%, .25) 91%, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .1) 12%, transparent 30%, rgba(0, 0, 0, .02) 50%, rgba(0, 0, 0, .2) 73.5%, rgba(0, 0, 0, .5) 75.25%, rgba(0, 0, 0, .15) 85.25%, transparent)',
          }"
        />

        <div class="h-full pl-1">
          <slot />
        </div>

        <div
          v-if="textured"
          class="pointer-events-none absolute inset-0 rotate-180 bg-cover bg-no-repeat opacity-50 brightness-110 mix-blend-hard-light"
          :style="texturedOverlayStyle"
        />
      </div>

      <div
        class="absolute left-0 bg-[linear-gradient(90deg,#eaeaea_0%,#0000_80%),linear-gradient(#fff,#fafafa)]"
        :style="{
          top: '3px',
          bottom: '3px',
          width: '48px',
          transform: `translateX(${bookSize.spineTranslation}) rotateY(90deg)`,
        }"
      />

      <div
        :class="
          cn(
            'absolute inset-y-0 left-0 flex size-full flex-col justify-end overflow-hidden p-[12%]',
            surfaceClass,
          )
        "
        :style="{
          transform: 'translateZ(-25px)',
          borderRadius: '6px 4px 4px 6px',
        }"
      />
    </div>
  </div>
</template>
