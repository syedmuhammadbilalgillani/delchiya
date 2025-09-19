import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { value, language, type, mediaUrl } = body;

  const updated = await prisma.translation.update({
    where: { id: Number(params.id) },
    data: {
      ...(value && { value }),
      ...(language && { language }),
      ...(type && { type }),
      ...(mediaUrl && { mediaUrl }),
    },
  });

  return NextResponse.json(updated);
}
