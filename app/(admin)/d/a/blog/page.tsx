"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/blogs");
        setBlogs(response.data);
        toast.success("Blogs loaded successfully");
      } catch (error) {
        toast.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        toast.success("Blog deleted successfully");
      } catch (error) {
        toast.error("Failed to delete blog");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-dvh justify-center items-center mb-4">
        <Loader2Icon className="animate-spin h-8 w-8 text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Blog List</h1>
        <Button asChild>
          <Link href="/d/a/blog/c">Create</Link>
        </Button>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Title
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Publish Date
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Feature Image
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 border-b text-center">
                {blog.title}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b text-center">
                {new Date(blog.publishDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b text-center">
                {blog.featureImage ? (
                  <img
                    src={blog.featureImage}
                    alt={blog.title}
                    className="max-h-20 mx-auto object-contain"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b text-center space-x-2">
                <Button
                  onClick={() => handleDelete(blog.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/d/a/blog/u/${blog.id}`}>Edit</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogList;
