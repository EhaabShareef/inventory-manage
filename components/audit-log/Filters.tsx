// src/components/audit-log/AuditLogFilters.tsx
import { useState } from 'react'
import { User } from '@prisma/client'
import { FilterOptions } from '@/actions/auditLog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface AuditLogFiltersProps {
  users: User[]
  actions: string[]
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

export function AuditLogFilters({ users, actions, filters, onFilterChange }: AuditLogFiltersProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(filters.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate)

  const handleUserChange = (value: string) => {
    const userIds = value === 'all' ? [] : [parseInt(value, 10)]
    onFilterChange({ ...filters, userIds, page: 1 })
  }

  const handleActionChange = (value: string) => {
    onFilterChange({ ...filters, action: value, page: 1 })
  }

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date)
      onFilterChange({ ...filters, startDate: date, page: 1 })
    } else {
      setEndDate(date)
      onFilterChange({ ...filters, endDate: date, page: 1 })
    }
  }

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Select onValueChange={handleUserChange} value={filters.userIds.length ? String(filters.userIds[0]) : 'all'}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={String(user.id)}>
              {user.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleActionChange} value={filters.action || 'all'}>
        <SelectTrigger className="w-[200px] md:w-[500px]">
          <SelectValue placeholder="Select action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Actions</SelectItem>
          {actions.map((action) => (
            <SelectItem key={action} value={action}>
              {action}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => handleDateChange('start', date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, 'PPP') : <span>End date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => handleDateChange('end', date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}