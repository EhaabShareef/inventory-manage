import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTM Inventory Management',
  description: 'Inventory management system for HTM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://db.onlinewebfonts.com/c/7dd5f4bf5d38875ca1822a830b6e6fe4?family=Aptos" />
      </head>
      <body className="font-aptos bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}