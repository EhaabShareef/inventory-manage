'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, List, Users, LogOut, Activity } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout } from '@/actions/auth'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/item', label: 'Items', icon: Package },
  { href: '/admin/category', label: 'Categories', icon: List },
  { href: '/admin/user', label: 'Users', icon: Users },
  { href: '/admin/audit-logs', label: 'Activity', icon: Activity },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-16 md:w-64 bg-primary text-secondary">
      <div className="flex items-center py-6 px-4 bg-primary">
        <span className="text-xl font-semibold hidden md:block">Admin Panel</span>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 hover:bg-primary/60",
                  pathname === item.href && "bg-secondary/10 text-secondary"
                )}
              >
                <item.icon className="h-5 w-5 md:mr-3" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full text-secondary bg-primary border-none md:border-white hover:bg-red-10 hover:text-red-500 hover:border-red-500"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </div>
  )
}