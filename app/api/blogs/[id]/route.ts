import prisma from "@/lib/prisma"; // Prisma Client
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Get the query param
  const {
    title,
    feature_image,
    publishDate,
    short_description,
    content,
    translations,
  } = await req.json();

  try {
    // Update main blog entry with translations
    const updatedBlog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: {
        title,
        feature_image,
        publishDate: new Date(publishDate),
        short_description,
        content,
        translations: {
          upsert: translations.map((translation: any) => ({
            where: {
              lang_code_blog_id: {
                lang_code: translation.lang_code,
                blog_id: parseInt(id),
              },
            },
            update: {
              title: translation.title,
              short_description: translation.short_description,
              content: translation.content,
              feature_image: translation.feature_image,
            },
            create: {
              lang_code: translation.lang_code,
              title: translation.title,
              short_description: translation.short_description,
              content: translation.content,
              feature_image: translation.feature_image,
            },
          })),
        },
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update the blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,

  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Get the query param

  try {
    await prisma.blog.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete the blog" },
      { status: 500 }
    );
  }
}
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id) },
      include: {
        translations: true, // Include all translations (English, Danish, etc.)
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Return the main blog data along with translations
    console.log(blog, "blogs");
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch the blog" },
      { status: 500 }
    );
  }
}
