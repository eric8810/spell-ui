<script lang="ts">
import { Fragment, defineComponent, h, type VNode } from 'vue'
import { cn } from '@/lib/utils'
import { flattenVNodes } from './slot-utils'

export default defineComponent({
  name: 'TextMarquee',
  inheritAttrs: false,
  props: {
    speed: {
      type: Number,
      default: 1,
    },
    class: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const prefixNodes = flattenVNodes((slots.prefix?.() ?? []) as VNode[])
      const itemNodes = flattenVNodes((slots.default?.() ?? []) as VNode[])
      const count = itemNodes.length || 1

      return h(Fragment, [
        h(
          'style',
          {
            key: 'text-marquee-style',
          },
          `
            @keyframes spell-ui-slide-vertical {
              to {
                translate: 0 var(--destination);
              }
            }
          `,
        ),
        h(
          'div',
          {
            ...attrs,
            class: cn('relative flex', props.class, attrs.class as string | undefined),
          },
          [
            h('div', { class: 'relative flex h-min w-min flex-row items-center gap-1 overflow-hidden' }, [
              prefixNodes.length
                ? h('div', { class: 'relative size-auto whitespace-pre' }, prefixNodes)
                : null,
              h(
                'div',
                {
                  class:
                    'relative w-auto overflow-hidden opacity-100 mask-[linear-gradient(rgba(0,0,0,0)_0%,rgb(0,0,0)_43.6902%,rgba(0,0,0,0)_100%)]',
                  style: {
                    height: `${props.height}px`,
                  },
                },
                [
                  h(
                    'div',
                    {
                      class: 'relative h-full',
                      style: {
                        '--count': count,
                        '--speed': props.speed,
                      },
                    },
                    itemNodes.map((child, index) =>
                      h(
                        'div',
                        {
                          key: `text-marquee-item-${index}`,
                          class: 'flex h-[40px] items-center',
                          style: {
                            '--index': index,
                            '--origin': `calc((var(--count) - var(--index)) * 100%)`,
                            '--destination': `calc((var(--index) + 1) * -100%)`,
                            '--duration': `calc(var(--speed) * ${count}s)`,
                            '--delay':
                              `calc((var(--duration) / var(--count)) * var(--index) - var(--duration))`,
                            translate: '0 var(--origin)',
                            animation:
                              'spell-ui-slide-vertical var(--duration) var(--delay) infinite linear',
                          },
                        },
                        [child],
                      ),
                    ),
                  ),
                ],
              ),
            ]),
          ],
        ),
      ])
    }
  },
})
</script>
