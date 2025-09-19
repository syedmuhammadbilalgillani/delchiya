import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const body = await req.json();
  const { value, language, type, mediaUrl } = body;
  const { id } = await params;
  const updated = await prisma.translation.update({
    where: { id: Number(id) },
    data: {
      ...(value && { value }),
      ...(language && { language }),
      ...(type && { type }),
      ...(mediaUrl && { mediaUrl }),
    },
  });

  return NextResponse.json(updated);
}
