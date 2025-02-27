import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientUpdateDialog } from "./Update"
import { ClientDeleteButton } from "./Delete"
import type { Client, ClientFormData } from "@/types/client"

interface ClientListProps {
  clients: Client[]
  onDelete: (id: number) => void
}

export function ClientList({ clients, onDelete }: ClientListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Resort Name</TableHead>
            <TableHead className="whitespace-nowrap">Company Name</TableHead>
            <TableHead className="whitespace-nowrap">GST TIN No.</TableHead>
            <TableHead className="whitespace-nowrap">IT Contact</TableHead>
            <TableHead className="whitespace-nowrap">Mobile No.</TableHead>
            <TableHead className="whitespace-nowrap">Email</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium whitespace-nowrap">{client.resortName}</TableCell>
              <TableCell className="whitespace-nowrap">{client.companyName}</TableCell>
              <TableCell className="whitespace-nowrap">{client.gstTinNo}</TableCell>
              <TableCell className="whitespace-nowrap">{client.itContact}</TableCell>
              <TableCell className="whitespace-nowrap">{client.mobileNo}</TableCell>
              <TableCell className="whitespace-nowrap">{client.email}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex justify-end space-x-2">
                  <ClientUpdateDialog client={client} />
                  <ClientDeleteButton client={client} onDelete={onDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

