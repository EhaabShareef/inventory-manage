// src/components/user/PasswordResetDialog.tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordResetDialogProps {
  userId: number
  onResetPassword: (id: number, newPassword: string) => void
}

export function PasswordResetDialog({ userId, onResetPassword }: PasswordResetDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleSubmit = () => {
    onResetPassword(userId, newPassword)
    setIsOpen(false)
    setNewPassword('')
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>Reset Password</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}