'use client';

import { useState, useEffect } from 'react';
import { Product, Brand, Category } from '@prisma/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

type ProductWithRelations = Product & {
  brand: Brand;
  category: Category;
};

interface ProductCardProps {
  product: ProductWithRelations;
  onAddToCart: (productId: string) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [shippingEstimate, setShippingEstimate] = useState<number | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(true);

  useEffect(() => {
    setIsLoadingShipping(true);
    fetch(`/api/shipping-estimate/${product.id}`)
      .then((r) => r.json())
      .then((data) => {
        setShippingEstimate(data.days);
        setIsLoadingShipping(false);
      })
      .catch((error) => {
        console.error('Error fetching shipping estimate:', error);
        setIsLoadingShipping(false);
      });
  }, [product.id]);

  // Don't render the product until shipping estimate is loaded
  if (isLoadingShipping) {
    return null;
  }
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>

      <CardContent className="flex-1 pt-4">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.brand.name}</p>
        <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>

        <div className="mt-2 flex items-center justify-between">
          <span
            className={`text-xs ${
              product.inventory === 0
                ? 'text-red-600 font-semibold'
                : product.inventory < 10
                ? 'text-orange-600'
                : 'text-green-600'
            }`}
          >
            {product.inventory === 0
              ? 'Out of Stock'
              : product.inventory < 10
              ? `Only ${product.inventory} left`
              : 'In Stock'}
          </span>

          {shippingEstimate !== null && (
            <span className="text-xs text-gray-600">Ships in {shippingEstimate} days</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart(product.id)}
          disabled={product.inventory === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;


