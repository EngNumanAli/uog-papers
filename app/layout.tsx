import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UOG Past Papers — Hafiz Hayat Campus',
  description: 'Find and share past exam papers for University of Gujrat, Hafiz Hayat Campus',
  keywords: ['UOG', 'past papers', 'Hafiz Hayat', 'University of Gujrat', 'exams'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
