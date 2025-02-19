import { AdminSidebar } from '@/components/AdminSidebar'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'MANAGE') {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-muted-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-primary shadow-sm z-10">
          <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <Breadcrumbs />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}