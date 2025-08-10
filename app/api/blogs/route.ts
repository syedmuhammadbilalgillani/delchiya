import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch blogs,${error}` },
      { status: 500 }
    );
  }
}
