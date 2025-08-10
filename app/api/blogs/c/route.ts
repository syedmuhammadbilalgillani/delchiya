import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    title,
    feature_image,
    publishDate,
    short_description,
    content,
    translations,
  } = await req.json();

  try {
    // Create the main blog entry
    const newBlog = await prisma.blog.create({
      data: {
        title,
        feature_image, // Main feature image for the default language
        publishDate: new Date(publishDate),
        short_description,
        content,
        translations: {
          create: translations.map((translation: any) => ({
            lang_code: translation.lang_code,
            title: translation.title,
            content: translation.content,
            short_description: translation.short_description,
            feature_image: translation.feature_image, // Feature image for the translation
          })),
        },
      },
    });

    return NextResponse.json(newBlog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create the blog" },
      { status: 500 }
    );
  }
}
