"use client"; // Mark this component as client-side

import { useLanguageStore } from "@/store/langStore"; // Zustand store for language
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const NewsDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { language } = useLanguageStore(); // Get language from Zustand store
  const [detail, setDetail] = useState<any>(null); // State to store blog details
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      const { id } = await params; // Get the dynamic ID from params

      try {
        // Fetch blog data by ID and language code
        const response = await axios.get(
          `/api/blogs/b/${id}?langCode=${language}`
        );
        console.log(response?.data, "res ");
        setDetail(response.data); // Set the blog data to state
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBlogData(); // Call the fetch function
  }, [params, language]); // Re-fetch when language or params change

  // Loader component
  const Loader = () => (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin" />
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (!detail) {
    return <p>No blog found</p>;
  }

  return (
    <>
      <div
        className="bg-center relative bg-cover md:min-h-[80dvh] h-[50dvh] w-full flex justify-center items-center"
        style={{ backgroundImage: `url('${detail.feature_image}')` }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <h1 className="text-white md:text-7xl font-marcellus font-normal">
            {detail.title}
          </h1>
        </div>
      </div>
      <div
        className="main"
        dangerouslySetInnerHTML={{ __html: detail.content || "<p></p>" }}
      />
    </>
  );
};

export default NewsDetailPage;
