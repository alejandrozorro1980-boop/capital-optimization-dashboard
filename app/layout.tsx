import './globals.css'

export const metadata = {
  title: 'Capital Optimization Dashboard',
  description: 'Plan de trabajo flexible para optimización de capital bancario',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
