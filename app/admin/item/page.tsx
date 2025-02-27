"use client"

import { useState, useEffect, useCallback } from "react"
import { getItems, getCategories, deleteItem } from "@/actions/item"
import { useDebounce } from "@/hooks/useDebounce"
import { ItemList } from "@/components/item/List"
import { ItemSearch } from "@/components/item/Search"
import { ItemCreateDialog } from "@/components/item/Create"
import type { Item, Category } from "@/types/item"
import { toast } from "sonner"

export default function ItemPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const fetchItems = useCallback(async () => {
    const result = await getItems(
      debouncedSearchTerm,
      selectedCategory ? Number.parseInt(selectedCategory) : undefined,
      currentPage,
    )
    if ("items" in result) {
      setItems(result.items)
      setTotalPages(result.totalPages)
    } else {
      console.error(result.error)
      toast.error("Failed to fetch items")
    }
  }, [debouncedSearchTerm, selectedCategory, currentPage])

  const fetchCategories = useCallback(async () => {
    const result = await getCategories()
    if ("categories" in result) {
      setCategories(result.categories)
    } else {
      console.error(result.error)
      toast.error("Failed to fetch categories")
    }
  }, [])

  useEffect(() => {
    fetchItems()
    fetchCategories()
  }, [fetchItems, fetchCategories])

  const handleRefresh = () => {
    fetchItems()
    fetchCategories()
  }

  const handleDelete = async (id: number) => {
    const result = await deleteItem(id)
    if ("success" in result) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
      toast.success("Item deleted successfully")
      //fetchItems()
    } else {
      console.error(result.error)
      toast.error("Failed to delete item")
    }
  }

  const handleUpdate = () => {
    console.info("Updating Item")
    //no need idk why its requesting this
  }

  return (
    <div className="mx-auto px-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Items</h1>
        <ItemCreateDialog categories={categories} />
      </div>
      <ItemSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        onRefresh={handleRefresh}
      />
      <ItemList items={items} categories={categories} onDelete={handleDelete} onUpdate={handleUpdate}/>
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

