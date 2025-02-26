import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'
import { ClientFormData } from "@/types/client"

interface ClientCreateDialogProps {
  onCreate: (data: ClientFormData) => void;
}

export function ClientCreateDialog({ onCreate }: ClientCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: '',
    resortName: '',
    gstTinNo: '',
    itContact: '',
    designation: '',
    resortContact: '',
    mobileNo: '',
    email: '',
    atoll: '',
    maleOfficeAddress: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onCreate(formData)
    setIsOpen(false)
    setFormData({
      companyName: '',
      resortName: '',
      gstTinNo: '',
      itContact: '',
      designation: '',
      resortContact: '',
      mobileNo: '',
      email: '',
      atoll: '',
      maleOfficeAddress: '',
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Client
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
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
            <Button type="submit" onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}