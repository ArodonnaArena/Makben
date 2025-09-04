import type { Metadata } from 'next'
import { Layout } from '../components/layout/Layout'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Makanjuola Ebenezer | Electrical Engineer',
  description: 'Professional portfolio of Makanjuola Ebenezer - Senior Electrical Engineer at NAMA, Nigeria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
