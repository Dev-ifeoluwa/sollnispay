'use client'

import { useEffect, useState } from 'react'

type InstallEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaProvider() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null)
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null)
  const [showIosHint, setShowIosHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Register service worker + watch for updates
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    let refreshing = false

    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then((reg) => {
      if (reg.waiting) setWaiting(reg.waiting)
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing
        sw?.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) setWaiting(sw)
        })
      })
      // check for a new version whenever the app comes back to the foreground
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {})
      })
    })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  }, [])

  // Install prompt (Android/Chrome) + iOS hint
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as InstallEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true
    if (isIos && !standalone) setShowIosHint(true)

    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const bar: React.CSSProperties = {
    position: 'fixed',
    left: 12,
    right: 12,
    bottom: 12,
    zIndex: 1000,
    padding: '12px 14px',
    borderRadius: 14,
    background: '#2a1c12',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontSize: 14,
  }
  const btn: React.CSSProperties = {
    padding: '8px 14px',
    borderRadius: 10,
    border: 'none',
    background: '#fff',
    color: '#2a1c12',
    fontWeight: 600,
  }

  if (waiting) {
    return (
      <div style={bar}>
        <span>A new version of Sollnis Pay is available.</span>
        <button style={btn} onClick={() => waiting.postMessage('SKIP_WAITING')}>
          Update
        </button>
      </div>
    )
  }

  if (installEvent && !dismissed) {
    return (
      <div style={bar}>
        <span>Install Sollnis Pay for quick access.</span>
        <span style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...btn, background: 'transparent', color: '#fff' }} onClick={() => setDismissed(true)}>
            Later
          </button>
          <button
            style={btn}
            onClick={async () => {
              await installEvent.prompt()
              await installEvent.userChoice
              setInstallEvent(null)
            }}
          >
            Install
          </button>
        </span>
      </div>
    )
  }

  if (showIosHint && !dismissed) {
    return (
      <div style={bar}>
        <span>To install: tap Share, then &quot;Add to Home Screen&quot;.</span>
        <button style={btn} onClick={() => setDismissed(true)}>
          OK
        </button>
      </div>
    )
  }

  return null
}