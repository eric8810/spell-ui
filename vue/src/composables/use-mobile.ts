import { ref, onMounted, onUnmounted } from 'vue'

// Keep JS mobile detection aligned with Tailwind's `md` breakpoint (48rem).
const MOBILE_MEDIA_QUERY = '(max-width: 47.999rem)'

export function useIsMobile() {
  const isMobile = ref<boolean>(false)

  onMounted(() => {
    const mql = window.matchMedia(MOBILE_MEDIA_QUERY)

    const checkMobile = () => {
      isMobile.value = mql.matches
    }

    checkMobile()
    mql.addEventListener('change', checkMobile)

    onUnmounted(() => {
      mql.removeEventListener('change', checkMobile)
    })
  })

  return isMobile
}
