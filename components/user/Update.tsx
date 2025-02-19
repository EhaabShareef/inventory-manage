// src/components/user/UserUpdateDialog.tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Role } from '@/types/user'

interface UserUpdateDialogProps {
  user: User
  onUpdate: (id: number, data: Partial<User>) => void
}

export function UserUpdateDialog({ user, onUpdate }: UserUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email || '',
    role: user.role,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: Role) => {
    setFormData(prev => ({ ...prev, role: value }))
  }

  const handleSubmit = () => {
    onUpdate(user.id, formData)
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>Edit</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.VIEW}>View</SelectItem>
                  <SelectItem value={Role.MANAGE}>Manage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}