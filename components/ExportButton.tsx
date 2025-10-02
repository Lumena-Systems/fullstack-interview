'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);

    try {
      const response = await fetch('/api/products/export');
      const { products } = await response.json();

      const csv = generateCSV(products);
      downloadFile(csv, 'products.csv');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      {loading ? 'Exporting...' : 'Export to CSV'}
    </Button>
  );
}

function generateCSV(products: any[]): string {
  const headers = ['ID', 'Name', 'Description', 'Price', 'Brand', 'Category', 'Inventory'];
  const rows = products.map((p) => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.description.replace(/"/g, '""')}"`,
    p.price,
    p.brand.name,
    p.category.name,
    p.inventory,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default ExportButton;
