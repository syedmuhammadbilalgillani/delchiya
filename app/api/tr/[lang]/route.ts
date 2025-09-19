import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      lang: string;
    }>;
  }
) {
  const { lang } = await params;

  if (!lang) {
    return NextResponse.json(
      { error: "Language not specified" },
      { status: 400 }
    );
  }

  try {
    const rows = await prisma.translation.findMany({
      where: { language: lang },
    });

    // Convert DB rows into { key: value } object
    const translations = rows.reduce(
      (acc: Record<string, string>, row: any) => {
        acc[row.key] = row.value || row.mediaUrl || "";
        return acc;
      },
      {}
    );

    return NextResponse.json({ common: translations });
  } catch (error) {
    console.error("Error fetching translations:", error);
    return NextResponse.json(
      { error: "Failed to load translations" },
      { status: 500 }
    );
  }
}
