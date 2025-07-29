import Image from "next/image";
import React from "react";

const Structure = () => {
  return (
    <div className="main text-center space-y-3">
      <div className="uppercase text-sm font-medium text-green">
        En Gennemtænkt rumfordeling
      </div>
      <h2 className="md:text-5xl text-4xl">Plantegning</h2>
      
      {/* Set a fixed aspect ratio container */}
      <div className="relative w-full aspect-[16/9] max-w-5xl mx-auto">
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
