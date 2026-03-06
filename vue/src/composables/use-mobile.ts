import { ref, onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 840

export function useIsMobile() {
  const isMobile = ref<boolean>(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }

  onMounted(() => {
    checkMobile()
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener('change', checkMobile)

    onUnmounted(() => {
      mql.removeEventListener('change', checkMobile)
    })
  })

  return isMobile
}
