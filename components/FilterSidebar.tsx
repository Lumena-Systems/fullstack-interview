'use client';

import { Brand, Category } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  brands: Brand[];
  categories: Category[];
  selectedBrand: string;
  selectedCategory: string;
  onBrandChange: (brandId: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

function FilterSidebar({
  brands,
  categories,
  selectedBrand,
  selectedCategory,
  onBrandChange,
  onCategoryChange,
}: FilterSidebarProps) {
  const hasFilters = selectedBrand || selectedCategory;

  return (
    <div className="space-y-4">
      {hasFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            onBrandChange('');
            onCategoryChange('');
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
              onClick={() =>
                onCategoryChange(selectedCategory === category.id ? '' : category.id)
              }
            >
              {category.name}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {brands.map((brand) => (
            <button
              key={brand.id}
              className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedBrand === brand.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
              onClick={() => onBrandChange(selectedBrand === brand.id ? '' : brand.id)}
            >
              {brand.name}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default FilterSidebar;


