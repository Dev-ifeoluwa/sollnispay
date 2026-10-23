/** Call this on logout (and on "Delete my account") so nothing user-related lingers on the device. */
export async function clearPwaCaches() {
  try {
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
    const reg = await navigator.serviceWorker?.getRegistration()
    reg?.active?.postMessage('CLEAR_CACHES')
  } catch {
    /* ignore */
  }
}