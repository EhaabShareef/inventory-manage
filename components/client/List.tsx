import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientUpdateDialog } from "./Update"
import { ClientDeleteButton } from "./Delete"
import { Client, ClientFormData } from "@/types/client"

interface ClientListProps {
  clients: Client[];
  onUpdate: (id: number, data: Partial<ClientFormData>) => void;
  onDelete: (id: number) => void;
}

export function ClientList({ clients, onUpdate, onDelete }: ClientListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resort Name</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>GST TIN No.</TableHead>
          <TableHead>IT Contact</TableHead>
          <TableHead>Mobile No.</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.resortName}</TableCell>
            <TableCell>{client.companyName}</TableCell>
            <TableCell>{client.gstTinNo}</TableCell>
            <TableCell>{client.itContact}</TableCell>
            <TableCell>{client.mobileNo}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>
              <ClientUpdateDialog client={client} onUpdate={onUpdate} />
              <ClientDeleteButton client={client} onDelete={onDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}