import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BetAI - Sports Analysis Platform',
  description: 'AI-powered sports analysis and betting insights for NFL, NBA, MLB, WNBA, and Soccer',
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
