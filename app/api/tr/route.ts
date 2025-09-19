import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await prisma.translation.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json(data);
}

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { key, en, ar, type, mediaUrl } = body;

//   const newItem = await prisma.translation.create({
//     data: { key, en, ar, type: type || 'text', mediaUrl },
//   });

//   return NextResponse.json(newItem);
// }
