'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Product, Brand, Category } from '@prisma/client';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ExportButton from '@/components/ExportButton';

type ProductWithRelations = Product & {
  brand: Brand;
  category: Category;
};

interface ProductsResponse {
  products: ProductWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface FiltersResponse {
  brands: Brand[];
  categories: Category[];
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Fetch filters
  const { data: filters } = useQuery<FiltersResponse>({
    queryKey: ['filters'],
    queryFn: async () => {
      const response = await fetch('/api/filters');
      return response.json();
    },
  });

  // Fetch product count
  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ['products-count'],
    queryFn: async () => {
      const response = await fetch('/api/products/count');
      return response.json();
    },
  });

  // Fetch products
  const { data, isLoading } = useQuery<ProductsResponse>({
    //These are the keys that will trigger a re-fetch
    queryKey: ['products', page, search, selectedCategory, selectedBrand],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedBrand && { brand: selectedBrand }),
      });

      const response = await fetch(`/api/products?${params}`);
      return response.json();
    },
  });

  const handleAddToCart = async (productId: string) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-gray-600 mt-1">
            {countData?.count ? `${countData.count.toLocaleString()} products available` : 'Loading...'}
          </p>
        </div>
        <ExportButton />
      </div>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          {filters && (
            <FilterSidebar
              brands={filters.brands}
              categories={filters.categories}
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              onBrandChange={setSelectedBrand}
              onCategoryChange={setSelectedCategory}
            />
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <ProductGrid
            products={data?.products || []}
            loading={isLoading}
            onAddToCart={handleAddToCart}
          />

          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}


