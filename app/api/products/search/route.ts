import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT p.* 
      FROM Product p
      LEFT JOIN Brand b ON p.brandId = b.id
      LEFT JOIN Supplier s ON b.supplierId = s.id
      LEFT JOIN Category c ON p.categoryId = c.id
      LEFT JOIN ProductAttribute pa ON p.id = pa.productId
      LEFT JOIN ProductReview pr ON p.id = pr.productId
      WHERE 
        p.name LIKE '%${query}%' OR
        p.description LIKE '%${query}%' OR
        b.name LIKE '%${query}%' OR
        c.name LIKE '%${query}%' OR
        pa.value LIKE '%${query}%' OR
        s.name LIKE '%${query}%' OR
        s.country LIKE '%${query}%' OR
        pr.title LIKE '%${query}%' OR
        pr.content LIKE '%${query}%' OR
        pr.author LIKE '%${query}%'
      LIMIT 50
    `);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
