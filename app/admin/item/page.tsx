'use client'

import { useState, useEffect } from 'react'
import { getItems, createItem, updateItem, deleteItem, getCategories } from '@/actions/item'
import { useDebounce } from '@/hooks/useDebounce'
import { ItemList } from '@/components/item/List'
import { ItemSearch } from '@/components/item/Search'
import { ItemCreateDialog } from '@/components/item/Create'
import { Item, Category, ItemFormData } from '@/types/inventory'


export default function ItemPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchItems = async () => {
      const result = await getItems(debouncedSearchTerm, selectedCategory ? parseInt(selectedCategory) : undefined, currentPage)
      if ('items' in result) {
        setItems(result.items)
        setTotalPages(result.totalPages)
      } else {
        console.error(result.error)
      }
    }

    const fetchCategories = async () => {
      const result = await getCategories()
      if ('categories' in result) {
        setCategories(result.categories)
      } else {
        console.error(result.error)
      }
    }

    fetchItems()
    fetchCategories()
  }, [debouncedSearchTerm, selectedCategory, currentPage])

  const handleCreate = async (data: ItemFormData) => {
    const result = await createItem(data)
    if ('item' in result) {
      setItems(prevItems => [...prevItems, result.item])
    } else {
      console.error(result.error)
    }
  }

  const handleUpdate = async (id: number, data: Partial<ItemFormData>) => {
    const result = await updateItem(id, data)
    if ('item' in result) {
      setItems(prevItems => prevItems.map(item => item.id === id ? result.item : item))
    } else {
      console.error(result.error)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await deleteItem(id)
    if ('success' in result) {
      setItems(prevItems => prevItems.filter(item => item.id !== id))
    } else {
      console.error(result.error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">Items</h1>
        <ItemCreateDialog onCreate={handleCreate} categories={categories} />
      </div>
      <ItemSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />
      <ItemList items={items} categories={categories} onUpdate={handleUpdate} onDelete={handleDelete} />
      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}