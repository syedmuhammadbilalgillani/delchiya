"use client"; // This is for marking the component as client-side

import { BlogCard } from "@/components/blog-card"; // Assuming you have this component
import { useLanguageStore } from "@/store/langStore"; // Zustand store for language
import axios from "axios"; // Axios for API requests
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BlogPage = () => {
  const [blogData, setBlogData] = useState<any[]>([]); // State to store fetched blogs
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const { language, setLanguage } = useLanguageStore(); // Use Zustand store for language
  const { t } = useTranslation();

  // Fetch preferred language from localStorage when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/blogs/b?langCode=${language}`);
        setBlogData(response.data); // Store fetched blog data in state
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (language) {
      fetchBlogs(); // Fetch blogs if preferred language is set
    }
  }, [language]); // Run this effect when language changes

  // Loader component
  const Loader = () => (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin" />
    </div>
  );

  return (
    <div>
      <div
        className="bg-center relative bg-cover min-h-dvh w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/blog.jpg')" }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <p className="text-white uppercase font-medium">
            {t("blog_latest_news")}
          </p>
          <h1 className="text-white md:text-7xl font-marcellus font-normal">
            {t("blog_our_news")}
          </h1>
        </div>
      </div>
      {/* Show the loader while fetching the blog data */}
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* If no blogs are available, show a message */}
          {blogData.length === 0 && <p>No blogs available</p>}

          {/* Grid to display blog cards */}
          <div className="grid grid-cols-1 gap-10 main mt-[5rem]">
            {blogData?.map((blog: any, index: number) => (
              <div key={blog.id}>
                <BlogCard
                  title={blog.title}
                  shortDescription={blog.short_description}
                  id={blog.id}
                  imageUrl={blog.feature_image}
                  index={index} // Pass the index to the BlogCard
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
