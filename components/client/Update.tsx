import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from 'lucide-react'
import { Client, ClientFormData } from "@/types/client"

interface ClientUpdateDialogProps {
  client: Client;
  onUpdate: (id: number, data: Partial<ClientFormData>) => void;
}

export function ClientUpdateDialog({ client, onUpdate }: ClientUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: client.companyName || '',
    resortName: client.resortName,
    gstTinNo: client.gstTinNo || '',
    itContact: client.itContact || '',
    designation: client.designation || '',
    resortContact: client.resortContact || '',
    mobileNo: client.mobileNo || '',
    email: client.email || '',
    atoll: client.atoll || '',
    maleOfficeAddress: client.maleOfficeAddress || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onUpdate(client.id, formData)
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={key} className="text-right">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input 
                  id={key} 
                  name={key} 
                  value={value} 
                  onChange={handleChange} 
                  className="col-span-3" 
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}