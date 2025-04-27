import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '拼圖遊戲',
  description: '一個有趣的拼圖遊戲',
}

export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  )
}