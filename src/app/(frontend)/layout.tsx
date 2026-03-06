import React from 'react'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import './styles.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  description: 'Exceptional spaces for work. Coworking & flexible office space in London.',
  title: 'Uncommon — Coworking & Flexible Office Space in London',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
