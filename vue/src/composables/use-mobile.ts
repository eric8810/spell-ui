import { onMounted, onUnmounted, ref } from 'vue'

// Keep JS mobile detection aligned with Tailwind's `md` breakpoint (48rem).
const MOBILE_MEDIA_QUERY = '(max-width: 47.999rem)'

export function useIsMobile() {
  const getMatches = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_MEDIA_QUERY).matches
  const isMobile = ref<boolean>(getMatches())
  let mql: MediaQueryList | null = null

  const checkMobile = () => {
    isMobile.value = getMatches()
  }

  onMounted(() => {
    mql = window.matchMedia(MOBILE_MEDIA_QUERY)
    checkMobile()
    mql.addEventListener('change', checkMobile)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', checkMobile)
  })

  return isMobile
}
