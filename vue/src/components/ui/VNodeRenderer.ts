import {
  cloneVNode,
  defineComponent,
  isVNode,
  type PropType,
  type VNodeChild,
} from 'vue'

const cloneChild = (
  value: VNodeChild,
  renderKey?: string | number,
  index = 0,
): VNodeChild => {
  if (Array.isArray(value)) {
    return value.map((child, childIndex) => cloneChild(child, renderKey, childIndex))
  }

  if (isVNode(value)) {
    const key = renderKey === undefined ? value.key ?? undefined : `${renderKey}-${index}`
    return cloneVNode(value, { key })
  }

  return value
}

export default defineComponent({
  name: 'VNodeRenderer',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      required: true,
    },
    renderKey: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    return () => cloneChild(props.node, props.renderKey)
  },
})
