<script lang="ts">
import { Fragment, cloneVNode, defineComponent, h, ref, type CSSProperties, type VNode } from 'vue'
import { cn } from '@/lib/utils'
import { flattenVNodes } from './slot-utils'

export default defineComponent({
  name: 'Marquee',
  inheritAttrs: false,
  props: {
    duration: {
      type: Number,
      default: 20,
    },
    pauseOnHover: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String as () => 'left' | 'right' | 'up' | 'down',
      default: 'left',
    },
    fade: {
      type: Boolean,
      default: true,
    },
    fadeAmount: {
      type: Number,
      default: 10,
    },
    class: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs, slots }) {
    const isPaused = ref(false)

    return () => {
      const items = flattenVNodes((slots.default?.() ?? []) as VNode[])
      const isVertical = props.direction === 'up' || props.direction === 'down'
      const animationName = isVertical
        ? props.direction === 'up'
          ? 'spell-ui-scroll-y'
          : 'spell-ui-scroll-y-reverse'
        : props.direction === 'left'
          ? 'spell-ui-scroll-x'
          : 'spell-ui-scroll-x-reverse'

      const maskStyle: CSSProperties = props.fade
        ? {
            maskImage: isVertical
              ? `linear-gradient(to bottom, transparent 0%, black ${props.fadeAmount}%, black ${
                  100 - props.fadeAmount
                }%, transparent 100%)`
              : `linear-gradient(to right, transparent 0%, black ${props.fadeAmount}%, black ${
                  100 - props.fadeAmount
                }%, transparent 100%)`,
            WebkitMaskImage: isVertical
              ? `linear-gradient(to bottom, transparent 0%, black ${props.fadeAmount}%, black ${
                  100 - props.fadeAmount
                }%, transparent 100%)`
              : `linear-gradient(to right, transparent 0%, black ${props.fadeAmount}%, black ${
                  100 - props.fadeAmount
                }%, transparent 100%)`,
          }
        : {}

      return h(Fragment, [
        h(
          'style',
          {
            key: 'marquee-style',
          },
          `
            @keyframes spell-ui-scroll-x {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }

            @keyframes spell-ui-scroll-x-reverse {
              from { transform: translateX(-50%); }
              to { transform: translateX(0); }
            }

            @keyframes spell-ui-scroll-y {
              from { transform: translateY(0); }
              to { transform: translateY(-50%); }
            }

            @keyframes spell-ui-scroll-y-reverse {
              from { transform: translateY(-50%); }
              to { transform: translateY(0); }
            }

            .spell-ui-marquee-scroller.paused {
              animation-play-state: paused;
            }
          `,
        ),
        h(
          'div',
          {
            ...attrs,
            class: cn(
              'flex w-full overflow-hidden',
              isVertical && 'flex-col',
              props.class,
              attrs.class as string | undefined,
            ),
            style: maskStyle,
            onMouseenter: () => {
              if (props.pauseOnHover) {
                isPaused.value = true
              }
            },
            onMouseleave: () => {
              if (props.pauseOnHover) {
                isPaused.value = false
              }
            },
          },
          [
            h(
              'div',
              {
                class: cn(
                  'spell-ui-marquee-scroller flex shrink-0',
                  isVertical && 'flex-col',
                  isPaused.value && 'paused',
                ),
                style: {
                  animationName,
                  animationDuration: `${props.duration}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                },
              },
              [
                ...items.map((item, index) =>
                  h(
                    'div',
                    {
                      key: `marquee-first-${index}`,
                      class: cn('flex shrink-0', isVertical && 'w-full'),
                    },
                    [cloneVNode(item, { key: `marquee-first-node-${index}` })],
                  ),
                ),
                ...items.map((item, index) =>
                  h(
                    'div',
                    {
                      key: `marquee-second-${index}`,
                      class: cn('flex shrink-0', isVertical && 'w-full'),
                    },
                    [cloneVNode(item, { key: `marquee-second-node-${index}` })],
                  ),
                ),
              ],
            ),
          ],
        ),
      ])
    }
  },
})
</script>
