import type { Metadata, Viewport } from 'next'
import { Sora, Inter } from 'next/font/google'
import { Layout } from '../components/layout/Layout'
import '../styles/globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://makben.vercel.app'),
  title: {
    default: 'Makanjuola Ebenezer | Electrical Engineer',
    template: '%s | Makanjuola Ebenezer',
  },
  description:
    'Portfolio of Makanjuola Ebenezer — Senior Electrical Engineer specializing in aviation systems, power infrastructure and maintenance at the Nigerian Airspace Management Agency (NAMA).',
  keywords: [
    'Makanjuola Ebenezer',
    'Electrical Engineer',
    'NAMA',
    'Aviation Systems',
    'Power Infrastructure',
    'Nigeria Engineer Portfolio',
  ],
  authors: [{ name: 'Makanjuola Ebenezer' }],
  openGraph: {
    title: 'Makanjuola Ebenezer | Electrical Engineer',
    description:
      'Senior Electrical Engineer specializing in aviation systems, power infrastructure and maintenance at NAMA, Nigeria.',
    type: 'website',
    images: ['/images/profile.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#07070f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
