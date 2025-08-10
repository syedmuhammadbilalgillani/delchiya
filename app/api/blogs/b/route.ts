import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma client

export async function GET(
  req: NextRequest,
) {
  const langCode = req.nextUrl.searchParams.get("langCode") || "en"; // Default to "en" if no langCode provided

  try {
    // Raw SQL query to join Blog and BlogTranslation based on langCode
    const result = (await prisma.$queryRaw`
      SELECT 
        b.id, 
        COALESCE(t.title, b.title) AS title, 
        COALESCE(t.feature_image, b.feature_image) AS feature_image,
        COALESCE(t.short_description, b.short_description) AS short_description,
        b."publishDate"
      FROM blog b  
      LEFT JOIN blog_translation t 
        ON b.id = t.blog_id 
        AND t.lang_code = ${langCode}
    `) as any;

    if (result.length === 0) {
      return NextResponse.json({ error: "No blogs found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
