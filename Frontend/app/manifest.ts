import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Sollnispay',
    short_name: 'Sollnispay',
    description: 'Fund your wallet, buy data and airtime, and send money.',
    start_url: '/Account/loginaccount',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    // background_color: '#FFFFFF', // splash screen colour (match your dark brown theme)
    background_color: '#1a110b', // splash screen colour (match your dark brown theme)
    theme_color: '#1a110b',
    icons: [
      { src: '/icons/sollnispay.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/sollnispay.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/sollnispay.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}