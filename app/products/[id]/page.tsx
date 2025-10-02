'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Product, Brand, Category, ProductAttribute } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type ProductWithRelations = Product & {
  brand: Brand;
  category: Category;
  attributes: ProductAttribute[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<ProductWithRelations>({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
  });

  const handleAddToCart = async () => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id, quantity }),
      });
      alert(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => router.push('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => router.push('/products')} className="mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-4">
            <Badge variant="secondary">{product.category.name}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{product.brand.name}</p>

          <p className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          {/* Attributes */}
          {product.attributes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Product Details</h3>
              <div className="flex flex-wrap gap-2">
                {product.attributes.map((attr) => (
                  <Badge key={attr.id} variant="outline">
                    {attr.key}: {attr.value}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            <span
              className={`text-sm font-semibold ${
                product.inventory === 0
                  ? 'text-red-600'
                  : product.inventory < 10
                  ? 'text-orange-600'
                  : 'text-green-600'
              }`}
            >
              {product.inventory === 0
                ? 'Out of Stock'
                : product.inventory < 10
                ? `Only ${product.inventory} left in stock`
                : 'In Stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Quantity:</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setQuantity(Math.min(product.inventory, quantity + 1))
                }
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}


