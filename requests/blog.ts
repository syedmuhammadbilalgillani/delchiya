import prisma from "@/lib/prisma";

// Function to fetch all blogs by language code (using raw SQL)
export const fetchBlogsByLang = async (langCode: string) => {
  try {
    // Raw SQL query to join Blog and BlogTranslation based on langCode
    const result = await prisma.$queryRaw`
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
  `;

    console.log(result);

    if (!result) {
      throw new Error("No blogs found");
    }

    return result;
  } catch (error: any) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
};
export const fetchBlogByIdAndLangCode = async (id: number, langCode: string) => {
    try {
      console.log("lang code",langCode)
      // Raw SQL query to fetch a specific blog by ID and langCode
      const result = await prisma.$queryRaw`
        SELECT 
          b.id, 
          COALESCE(t.title, b.title) AS title, 
          COALESCE(t.feature_image, b.feature_image) AS feature_image,
          COALESCE(t.short_description, b.short_description) AS short_description,
          COALESCE(t.content, b.content) AS content,
          b."publishDate"
        FROM blog b
        LEFT JOIN blog_translation t 
          ON b.id = t.blog_id 
          AND t.lang_code = ${langCode}
        WHERE b.id = ${id}
      ` as any[];
  
      // Log the result to check if data is fetched correctly
      console.log(result);
  
      // If no result is found, throw an error
      if (!result || result.length === 0) {
        throw new Error("Blog not found");
      }
  
      // Return the fetched blog data
      return result[0]; // Since we are querying by ID, the result should contain only one blog
    } catch (error: any) {
      throw new Error(`Failed to fetch blog by ID and langCode: ${error.message}`);
    }
  };