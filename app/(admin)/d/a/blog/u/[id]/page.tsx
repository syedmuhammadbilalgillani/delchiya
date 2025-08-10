"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import JoditEditorComponent from "@/components/editor";
import { Button } from "@/components/ui/button";

const UpdateBlog = () => {
  const [blog, set_blog] = useState<any>(null);
  const [title, set_title] = useState(""); // English title
  const [danish_title, set_danish_title] = useState(""); // Danish title
  const [feature_image, set_feature_image] = useState<string | null>(null);
  const [publishDate, set_publishDate] = useState("");
  const [short_description, set_short_description] = useState(""); // English short description
  const [danish_short_description, set_danish_short_description] = useState(""); // Danish short description
  const [content, set_content] = useState(""); // English content
  const [danish_content, set_danish_content] = useState(""); // Danish content
  const [danish_feature_image, set_danish_feature_image] = useState<string | null>(null); // Danish feature image
  const [loading, set_loading] = useState(false); // Loading state

  const router = useRouter();
  const { id } = useParams();

  // Handle file upload and convert to base64
  const handle_file_upload = (e: React.ChangeEvent<HTMLInputElement>, lang_code: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          if (lang_code === "en") {
            set_feature_image(reader.result as string); // Set the base64 string for English
          } else if (lang_code === "da") {
            set_danish_feature_image(reader.result as string); // Set the base64 string for Danish
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch blog data by ID when the component mounts
  useEffect(() => {
    const fetch_blog_data = async () => {
      set_loading(true);
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        const blog_data = response.data;
        set_blog(blog_data);
        set_title(blog_data.title);
        set_danish_title(blog_data.translations.find((t: any) => t.lang_code === "da")?.title || ""); // Set Danish title
        set_feature_image(blog_data.feature_image);
        set_danish_feature_image(blog_data.translations.find((t: any) => t.lang_code === "da")?.feature_image || ""); // Set Danish feature image
        set_publishDate(blog_data.publishDate ? new Date(blog_data.publishDate).toISOString().slice(0, 16) : "");
        set_short_description(blog_data.short_description);
        set_danish_short_description(blog_data.translations.find((t: any) => t.lang_code === "da")?.short_description || ""); // Set Danish short description
        set_content(blog_data.content);
        set_danish_content(blog_data.translations.find((t: any) => t.lang_code === "da")?.content || ""); // Set Danish content
      } catch (error) {
        toast.error("Failed to fetch blog data");
      } finally {
        set_loading(false);
      }
    };

    if (id) {
      fetch_blog_data();
    }
  }, [id]);

  // Handle form submission to update the blog
  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !feature_image || !content || !publishDate || !danish_title || !danish_content || !danish_feature_image) {
      toast.error("Please fill in all fields.");
      return;
    }

    set_loading(true); // Set loading to true when submitting

    try {
      await axios.put(`/api/blogs/${id}`, {
        title,
        feature_image, // Send the base64 image
        publishDate,
        short_description,
        content,
        translations: [
          {
            lang_code: "en",
            title,
            short_description,
            content,
            feature_image,
          },
          {
            lang_code: "da",
            title: danish_title,
            short_description: danish_short_description,
            content: danish_content,
            feature_image: danish_feature_image,
          },
        ],
      });
      toast.success("Blog updated successfully");
      router.push("/d/a/blog"); // Redirect to the homepage or list after update
    } catch (error) {
      toast.error("Failed to update blog");
    } finally {
      set_loading(false); // Set loading to false after submitting
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2Icon className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (!blog) return <div>Loading...</div>;

  return (
    <form onSubmit={handle_submit} className="grid grid-cols-2 gap-10 space-y-4 p-10">
      <div>
        <input
          type="text"
          placeholder="Title (English)"
          value={title}
          onChange={(e) => set_title(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
       
        <input
          type="text"
          placeholder="Title (Danish)"
          value={danish_title}
          onChange={(e) => set_danish_title(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
     
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handle_file_upload(e, "en")}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {feature_image && (
          <div className="mt-2">
            <img
              src={feature_image}
              alt="Preview"
              className="max-h-40 mx-auto object-contain"
            />
          </div>
        )}
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handle_file_upload(e, "da")}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {danish_feature_image && (
          <div className="mt-2">
            <img
              src={danish_feature_image}
              alt="Preview"
              className="max-h-40 mx-auto object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <textarea
          placeholder="Short Description (English)"
          value={short_description}
          onChange={(e) => set_short_description(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <textarea
          placeholder="Short Description (Danish)"
          value={danish_short_description}
          onChange={(e) => set_danish_short_description(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="col-span-1">
        <JoditEditorComponent
          name="content"
          placeholder="Write your blog content (English) here..."
          initialValue={content}
          onChange={set_content}
          error="Content is required"
        />
      </div>

      <div className="col-span-1">
        <JoditEditorComponent
          name="danish_content"
          placeholder="Write your blog content (Danish) here..."
          initialValue={danish_content}
          onChange={set_danish_content}
          error="Content (Danish) is required"
        />
      </div>
      <div className="col-span-2">
        <input
          type="datetime-local"
          value={publishDate}
          onChange={(e) => set_publishDate(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Button
        type="submit"
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <Loader2Icon className="animate-spin h-5 w-5 mx-auto" />
        ) : (
          "Update Blog"
        )}
      </Button>
    </form>
  );
};

export default UpdateBlog;
