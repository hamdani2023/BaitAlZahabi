import './globals.css'
import Providers  from './providers'
import BottomNav  from '@/components/BottomNav'
import Toast      from '@/components/Toast'
import LangWrapper from '@/components/LangWrapper'

export const metadata = {
  title:       "Maison d'or — Fine Dining",
  description: 'تجربة طعام فاخرة لا تُنسى',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Tajawal:wght@300;400;500;700;800;900&family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <LangWrapper>
            <Toast />
            <main className="relative z-10">{children}</main>
            <BottomNav />
          </LangWrapper>
        </Providers>
      </body>
    </html>
  )
}
