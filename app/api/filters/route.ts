import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [brands, categories] = await Promise.all([
      prisma.brand.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);

    return NextResponse.json({ brands, categories });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}


