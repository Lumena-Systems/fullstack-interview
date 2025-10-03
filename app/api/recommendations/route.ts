import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate delay of 500ms
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return NextResponse.json(['Product A', 'Product B', 'Product C']);
}

