import { fetchHouseData } from "@/constants/api";
import { Suspense } from "react";
import GalleryPage from "./gallery-page";

const Gallery = async () => {
  const houseData = await fetchHouseData();
  console.log("House Data:", houseData);
 
  return (
    <Suspense>
      <GalleryPage data={houseData} />
    </Suspense>
  );
};

export default Gallery;
