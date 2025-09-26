import type { Metadata } from 'next'
import { Inter, Exo_2 } from 'next/font/google'
import './globals.css'
import '../styles/scrollbars.css'
import '../styles/main-scrollbars.css'
import '../styles/scrollbar-fix.css'
import '../styles/acolito-main-scrollbar.css'
import '../styles/iniciado-main-scrollbar.css'
import '../styles/warrior-main-scrollbar.css'
import '../styles/lord-main-scrollbar.css'
import '../styles/darth-main-scrollbar.css'
import '../styles/maestro-main-scrollbar.css'
import '../styles/force-acolito-scrollbar.css'
import '../styles/ultra-force-acolito-scrollbar.css'
import '../styles/dashboard-selection-scrollbar.css'
import '../styles/dashboard-spinners.css'
import '../styles/sidebar-hover-fix.css'
import '../styles/sith-scrollbar.css'
import '../styles/force-scrollbar.css'
import { AuthProvider } from '@/context/AuthContext-fixed'
import { ProgressProvider } from '@/context/ProgressContext'
import { ScrollProvider } from '@/context/ScrollContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const exo2 = Exo_2({ subsets: ['latin'], variable: '--font-exo' })

export const metadata: Metadata = {
  title: 'Crypto Force',
  description: 'Crypto Force – Comunidad y Herramientas. Contenido exclusivo y educativo para todos los Acólitos.',
  metadataBase: new URL('http://localhost:3000'),
  icons: {
    icon: '/logo.ico',
  },
  openGraph: {
    title: 'Crypto Force – Comunidad y Herramientas',
    description: 'Contenido exclusivo y educativo para todos los Acólitos. Herramientas y mucho más.',
    images: ['/preview.png'],
    url: 'https://thecryptoforce.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
        />
      </head>
      <body className={`${inter.variable} ${exo2.variable} bg-[#121212] text-white`}>
        <AuthProvider>
          <ProgressProvider>
            <ScrollProvider>
              <div className="triangle-background">
                <div className="triangle-dots"></div>
              </div>
              <div className="relative z-10">
                {children}
              </div>
            </ScrollProvider>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}