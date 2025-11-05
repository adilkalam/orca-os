import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Design Showcase',
  description: 'Token-driven UI showcase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
