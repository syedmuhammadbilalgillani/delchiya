"use client";
import { useState } from "react";
import axios from "axios";
import JoditEditorComponent from "@/components/editor";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CreateBlog = () => {
  const [title, setTitle] = useState(""); // English title
  const [danishTitle, setDanishTitle] = useState(""); // Danish title
  const [featureImage, setFeatureImage] = useState<string | null>(null);
  const [publishDate, setPublishDate] = useState("");
  const [shortDescription, setShortDescription] = useState(""); // English short description
  const [danishShortDescription, setDanishShortDescription] = useState(""); // Danish short description
  const [content, setContent] = useState(""); // English content
  const [danishContent, setDanishContent] = useState(""); // Danish content
  const [danishFeatureImage, setDanishFeatureImage] = useState<string | null>(
    null
  ); // Danish feature image
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  // Handle file upload and convert to base64
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    langCode: string
  ) => {
    const file = e.target.files?.[0]; // Get the first file (if any)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          if (langCode === "en") {
            setFeatureImage(reader.result as string); // Store the base64 string for English
          } else if (langCode === "da") {
            setDanishFeatureImage(reader.result as string); // Store the base64 string for Danish
          }
        }
      };
      reader.readAsDataURL(file); // Read file as DataURL (Base64)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that feature images are uploaded for both languages
    if (!featureImage || !danishFeatureImage) {
      toast.error("Please upload a feature image for both languages.");
      return;
    }

    setLoading(true); // Set loading to true when submitting

    try {
      const data = await axios.post("/api/blogs/c", {
        title,
        feature_image: featureImage,
        publishDate,
        short_description: shortDescription,
        content,
        translations: [
          {
            lang_code: "en",
            title,
            short_description: shortDescription,
            content,
            feature_image: featureImage,
          },
          {
            lang_code: "da",
            title: danishTitle,
            short_description: danishShortDescription,
            content: danishContent,
            feature_image: danishFeatureImage,
          },
        ],
      });
      toast.success("Blog created successfully");
      router.push("/d/a/blog");
    } catch (error) {
      toast.error("Failed to create blog");
    } finally {
      setLoading(false); // Set loading to false after submitting
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen grid grid-cols-1 justify-items-center items-center gap-4 p-4"
    >
      <div className="w-full grid grid-cols-2 gap-10 space-y-4">
        {/* English Title */}
        <div>
          <input
            type="text"
            placeholder="Title (English)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Danish Title */}
        <div>
          <input
            type="text"
            placeholder="Title (Danish)"
            value={danishTitle}
            onChange={(e) => setDanishTitle(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Upload for Feature Image (English) */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "en")}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {featureImage && (
            <div className="mt-2">
              <img
                src={featureImage}
                alt="Preview"
                className="max-h-40 mx-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* File Upload for Feature Image (Danish) */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "da")}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {danishFeatureImage && (
            <div className="mt-2">
              <img
                src={danishFeatureImage}
                alt="Preview"
                className="max-h-40 mx-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* Publish Date */}
        <div>
          <input
            type="datetime-local"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Short Description (English) */}
        <div>
          <textarea
            placeholder="Short Description (English)"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Short Description (Danish) */}
        <div>
          <textarea
            placeholder="Short Description (Danish)"
            value={danishShortDescription}
            onChange={(e) => setDanishShortDescription(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content Editor (English) */}
        <div className="col-span-2">
          <JoditEditorComponent
            name="content"
            placeholder="Write your blog content (English) here..."
            initialValue={content}
            onChange={setContent}
            error="Content is required"
          />
        </div>

        {/* Content Editor (Danish) */}
        <div className="col-span-2">
          <JoditEditorComponent
            name="danishContent"
            placeholder="Write your blog content (Danish) here..."
            initialValue={danishContent}
            onChange={setDanishContent}
            error="Content (Danish) is required"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <Loader2Icon className="animate-spin h-5 w-5 mx-auto" />
          ) : (
            "Create Blog"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateBlog;
