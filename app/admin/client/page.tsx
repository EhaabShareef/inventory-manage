"use client"

import { useState, useEffect, useCallback } from "react"
import { ClientList } from "@/components/client/List"
import { ClientCreateDialog } from "@/components/client/Create"
import { ClientSearch } from "@/components/client/Search"
import { getClients, deleteClient } from "@/actions/client"
import type { Client } from "@/types/client"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const pageSize = 10 // Number of items per page

  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getClients(searchTerm, currentPage, pageSize)
      if ("clients" in result) {
        setClients(result.clients)
        setTotalPages(result.totalPages)
      } else {
        toast.error("Failed to fetch clients", { description: result.error })
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, currentPage])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteClient(id)
      if ("success" in result) {
        toast.success("Client deleted successfully")
        await fetchClients()
      } else {
        toast.error("Failed to delete client", { description: result.error })
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  const handleRefresh = () => {
    fetchClients()
  }

  return (
    <div className="mx-auto px-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Clients</h1>
        <ClientCreateDialog />
      </div>
      <ClientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} onRefresh={handleRefresh} />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ClientList clients={clients} onDelete={handleDelete} />
      )}
      {/* Pagination controls */}
      <div className="flex justify-center mt-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === page ? "bg-primary text-white" : "bg-gray-200"} mb-2`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}

