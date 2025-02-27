"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/category";
import { useDebounce } from "@/hooks/useDebounce";
import { CategoryList } from "@/components/category/List";
import { CategorySearch } from "@/components/category/Search";
import { CategoryCreateDialog } from "@/components/category/Create";
import type { Category, CategoryWithItemCount } from "@/types/category";
import { toast } from "sonner";

export default function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setCategories] = useState<Category[]>([]);
  const [categoriesWithCount, setCategoriesWithCount] = useState<
    CategoryWithItemCount[]
  >([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories(debouncedSearchTerm);
      if ("categories" in result) {
        setCategories(result.categories);
        setCategoriesWithCount(result.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [debouncedSearchTerm]);

  const handleCreate = async (
    formData: FormData
  ): Promise<
    { error?: string; errors?: Record<string, string[]> } | undefined
  > => {
    const result = await createCategory(formData);
    if ("category" in result) {
      setCategories((prevCategories) => [...prevCategories, result.category]);
      setCategoriesWithCount((prevCategories) => [
        ...prevCategories,
        { ...result.category, _count: { items: 0 } },
      ]);
      toast.success("Category created successfully");
      return undefined;
    } else {
      toast.error(result.error);
      return { error: result.error, errors: result.errors };
    }
  };

  const handleUpdate = async (formData: FormData) => {
    const result = await updateCategory(formData);
    if ("category" in result) {
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === result.category.id ? result.category : cat
        )
      );
      setCategoriesWithCount((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === result.category.id
            ? { ...result.category, _count: cat._count }
            : cat
        )
      );
      toast.success("Category updated successfully");
      return {};
    } else {
      toast.error(result.error);
      return result;
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteCategory(id);
    if ("success" in result) {
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
      setCategoriesWithCount((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
      toast.success("Category deleted successfully");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="container mx-auto px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">Categories</h1>
        <CategoryCreateDialog onCreate={handleCreate} />
      </div>
      <CategorySearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryList
        categories={categoriesWithCount}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
