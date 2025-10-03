'use client';

import { useState, useEffect } from 'react';
import { Product, Brand, Category } from '@prisma/client';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

type CartItemWithProduct = {
  id: string;
  quantity: number;
  product: Product & {
    brand: Brand;
    category: Category;
  };
};

interface CartItemProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const recommendations = getRecommendations(item.product);

  return (
    <div className="border rounded-lg p-4 mb-3 bg-white">
      <div className="flex gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            className="object-cover rounded"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">{item.product.name}</h3>
          <p className="text-sm text-gray-600">{item.product.brand.name}</p>
          <p className="text-lg font-bold mt-1">{formatPrice(item.product.price)}</p>

          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium">You might also like:</span> {recommendations.join(', ')}
          </div>
        </div>

        <div className="flex flex-col justify-between items-end">
          <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
          </div>

          <p className="font-semibold mt-2">
            {formatPrice(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartItem;

// Fetch product recommendations
function getRecommendations(product: Product & { category: Category }): string[] {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/recommendations`, false);
    xhr.send();
    
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      return data;
    }
  } catch (error) {
    // Silently fail and return fallback
  }
  
  // Fallback recommendations
  return ['Product A', 'Product B', 'Product C'];
}
