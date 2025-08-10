import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  shortDescription: string;
  id: string;
  imageUrl: string;
  index: number; // Add index to determine whether to reverse layout
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  shortDescription,
  id,
  imageUrl,
  index, // Use index to alternate image position
}) => {
  return (
    <div
      className={`flex max-md:flex-col  gap-10 min-h-[50dvh] overflow-hidden  justify-between items-center border mb-4 ${
        index % 2 === 0 ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Text Section */}
      <div className="flex flex-col justify-between md:w-1/2 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{shortDescription}</p>

        <Link className="group" href={`/news/${id}`}>
          <div className="flex items-center">
            Read more
            <span className="group-hover:pl-2 mt-0.5 transition-all">
              <ChevronRight size={17} />
            </span>
          </div>
          <div className="h-0.5 bg-yellow w-20 group-hover:w-0 transition-all"></div>
        </Link>
      </div>

      {/* Image Section */}
      <div className="w-full h-fit md:w-1/2 mt-4 md:mt-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full object-cover min-h-[40dvh] max-h-[50dvh] h-full"
        />
      </div>
    </div>
  );
};
