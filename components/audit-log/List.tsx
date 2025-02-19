// src/components/audit-log/AuditLogList.tsx
import { AuditLogWithUser } from '@/actions/auditLog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AuditLogListProps {
  auditLogs: AuditLogWithUser[]
}

export function AuditLogList({ auditLogs }: AuditLogListProps) {
  if (auditLogs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No activity logs found</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.user.username}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.details}</TableCell>
            <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}