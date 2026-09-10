import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduVerse — Integrated Campus Management Platform',
  description: 'EduVerse unifies attendance, timetables, learning materials, assignments, quizzes, coding exams, marks, and counseling into one integrated campus platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
