'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/actions/category'
import { useDebounce } from '@/hooks/useDebounce'
import { CategoryList } from '@/components/category/List'
import { CategorySearch } from '@/components/category/Search'
import { CategoryCreateDialog } from '@/components/category/Create'

interface Category {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
      items: number;
    };
  }

export default function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories(debouncedSearchTerm)
      if (result.categories) {
        setCategories(result.categories)
      }
    }

    fetchCategories()
  }, [debouncedSearchTerm])

  const handleCreate = async (name: string) => {
    const result = await createCategory(name)
    if (result.category) {
      setCategories([...categories, result.category])
    } else {
      console.error(result.error)
    }
  }

  const handleUpdate = async (id: number, name: string) => {
    const result = await updateCategory(id, name)
    if (result.category) {
      setCategories(categories.map(cat => 
        cat.id === id ? result.category : cat
      ))
    } else {
      console.error(result.error)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await deleteCategory(id)
    if (result.success) {
      setCategories(categories.filter(cat => cat.id !== id))
    } else {
      console.error(result.error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">Categories</h1>
        <CategoryCreateDialog onCreate={handleCreate} />
      </div>
      <CategorySearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryList categories={categories} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  )
}