'use client';

import { useEffect, useState } from 'react';

function ShippingEstimate({ productId }: { productId: string }) {
  const [estimate, setEstimate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shipping-estimate/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setEstimate(data.days);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching shipping estimate:', error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <span className="text-gray-400 text-xs">Calculating...</span>;
  return <span className="text-xs text-gray-600">Ships in {estimate} days</span>;
}

export default ShippingEstimate;
