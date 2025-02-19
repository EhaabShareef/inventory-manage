// src/app/admin/audit-logs/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAuditLogs, getUsers, getUniqueActions, AuditLogWithUser, FilterOptions } from '@/actions/auditLog'
import { AuditLogList } from '@/components/audit-log/List'
import { AuditLogFilters } from '@/components/audit-log/Filters'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogWithUser[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [actions, setActions] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    userIds: [],
    action: '',
    startDate: undefined,
    endDate: undefined,
    page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAuditLogs(filters)
      setAuditLogs(result.logs)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      setError('Failed to fetch audit logs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fetchedUsers, fetchedActions] = await Promise.all([
          getUsers(),
          getUniqueActions(),
        ])
        setUsers(fetchedUsers)
        setActions(fetchedActions)
      } catch (error) {
        console.error('Error fetching initial data:', error)
        setError('Failed to fetch initial data. Please refresh the page.')
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchAuditLogs()
  }, [fetchAuditLogs])

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters)
  }, [])

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <AuditLogFilters
        users={users}
        actions={actions}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <AuditLogList auditLogs={auditLogs} />
          {auditLogs.length > 0 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === filters.page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}