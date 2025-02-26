"use client"

import { useState, useEffect } from "react"
import { ClientList } from "@/components/client/List"
import { ClientCreateDialog } from "@/components/client/Create"
import { ClientSearch } from "@/components/client/Search"
import { getClients, createClient, updateClient, deleteClient } from "@/actions/client"
import type { Client, ClientFormData } from "@/types/client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pageSize = 10 // Number of items per page

  useEffect(() => {
    fetchClients()
  }, [searchTerm, currentPage])

  const fetchClients = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getClients(searchTerm, currentPage, pageSize)
      if ("clients" in result) {
        setClients(result.clients)
        setTotalPages(result.totalPages)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: ClientFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await createClient(data)
      if ("client" in result) {
        await fetchClients()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: number, data: Partial<ClientFormData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await updateClient(id, data)
      if ("client" in result) {
        await fetchClients()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await deleteClient(id)
      if ("success" in result) {
        await fetchClients()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <div className="w-full sm:w-auto mb-2 sm:mb-0">
          <ClientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <ClientCreateDialog onCreate={handleCreate} />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <ClientList clients={clients} onUpdate={handleUpdate} onDelete={handleDelete} />
          </div>
          <div className="flex flex-wrap justify-center mt-4 space-x-2 space-y-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className="mb-2"
              >
                {page}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

