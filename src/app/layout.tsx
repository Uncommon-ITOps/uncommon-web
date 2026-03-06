import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Uncommon — Coworking & Flexible Office Space in London',
  description: 'Exceptional spaces for work. Coworking & flexible office space in London.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
