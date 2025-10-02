import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    
    
    return NextResponse.json({ 
      count: products.length,
    });
  } catch (error) {
    console.error('Error counting products:', error);
    return NextResponse.json({ error: 'Failed to count products' }, { status: 500 });
  }
}
