// src/components/user/UserList.tsx
import { User, Role } from '@/types/user'
import { UserUpdateDialog } from './Update'
import { PasswordResetDialog } from './PasswordReset'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserListProps {
  users: User[]
  onUpdate: (id: number, data: Partial<User>) => void
  onResetPassword: (id: number, newPassword: string) => void
}

export function UserList({ users, onUpdate, onResetPassword }: UserListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <UserUpdateDialog user={user} onUpdate={onUpdate} />
              <PasswordResetDialog userId={user.id} onResetPassword={onResetPassword} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}