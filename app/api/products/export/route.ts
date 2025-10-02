import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json({ error: 'Failed to export products' }, { status: 500 });
  }
}
