'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)

  return (
    <nav className="text-sm font-medium text-muted-foreground">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link href="#" className="hover:text-accent">Admin</Link>
        </li>
        {paths.slice(1).map((path, index) => {
          const href = `/admin/${paths.slice(1, index + 2).join('/')}`
          const label = path.charAt(0).toUpperCase() + path.slice(1)
          const isLast = index === paths.length - 2

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2" />
              {isLast ? (
                <span className="text-secondary">{label}</span>
              ) : (
                <Link href={href} className="hover:text-accent">
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}