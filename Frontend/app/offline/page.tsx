'use client'

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>You&apos;re offline</h1>
      <p style={{ maxWidth: 320, opacity: 0.8 }}>
        Sollnispay needs an internet connection to keep your money and data safe. Please reconnect and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid currentColor' }}
      >
        Retry
      </button>
    </main>
  )
}