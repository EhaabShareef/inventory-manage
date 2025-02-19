// src/components/user/UserCreateDialog.tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserInput, Role } from '@/types/user'

interface UserCreateDialogProps {
  onCreate: (data: UserInput) => void
}

export function UserCreateDialog({ onCreate }: UserCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<UserInput>({
    username: '',
    email: '',
    password: '',
    role: Role.VIEW,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: Role) => {
    setFormData(prev => ({ ...prev, role: value }))
  }

  const handleSubmit = () => {
    // Convert empty email string to null
    const dataToSubmit = {
      ...formData,
      email: formData.email || null
    }
    onCreate(dataToSubmit)
    setIsOpen(false)
    setFormData({ username: '', email: '', password: '', role: Role.VIEW })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create User</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email || ''} 
                onChange={handleChange} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="col-span-3" />
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
            <Button type="submit" onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}