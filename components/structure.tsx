import Image from "next/image";
import React from "react";
import Text from "./Language/TranslatedText";

const Structure = () => {
  return (
    <div className="main text-center space-y-3">
      <Text
        as="div"
        className="uppercase text-sm font-medium text-green"
        textKey="thoughtfulLayout"
      />

      <Text as="h2" className="md:text-5xl text-4xl" textKey="floorPlan" />

      {/* Set a fixed aspect ratio container */}
      <div className="relative w-full aspect-[13/9] max-w-5xl mx-auto">
        <Image
          src="/structure.jpg"
          alt="Plantegning"
          fill
          className="object-contain object-center"
        />
      </div>
    </div>
  );
};

export default Structure;
