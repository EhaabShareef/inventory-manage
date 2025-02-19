// src/app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, resetPassword } from '@/actions/user'
import { UserList } from '@/components/user/List'
import { UserCreateDialog } from '@/components/user/Create'
import { User, UserInput, Role } from '@/types/user'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers()
      if ('users' in result) {
        setUsers(result.users)
      } else {
        console.error(result.error)
      }
    }

    fetchUsers()
  }, [])

  const handleCreate = async (data: UserInput) => {
    const result = await createUser(data)
    if ('user' in result) {
      setUsers(prevUsers => [...prevUsers, result.user])
    } else {
      console.error(result.error)
    }
  }

  const handleUpdate = async (id: number, data: Partial<UserInput>) => {
    const result = await updateUser(id, data)
    if ('user' in result) {
      setUsers(prevUsers => prevUsers.map(user => user.id === id ? result.user : user))
    } else {
      console.error(result.error)
    }
  }

  const handleResetPassword = async (id: number, newPassword: string) => {
    const result = await resetPassword(id, newPassword)
    if ('success' in result) {
      console.log('Password reset successfully')
    } else {
      console.error(result.error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <UserCreateDialog onCreate={handleCreate} />
      </div>
      <UserList 
        users={users} 
        onUpdate={handleUpdate} 
        onResetPassword={handleResetPassword} 
      />
    </div>
  )
}