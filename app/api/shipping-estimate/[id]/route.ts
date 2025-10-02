import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return random shipping estimate
  const days = Math.floor(Math.random() * 5) + 3; // 3-7 days

  return NextResponse.json({ days });
}