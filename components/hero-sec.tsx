"use client";

import Image from "next/image";

const HeroSection = () => {
  return (
    <div
      className="relative  h-[80dvh] max-sm:h-[60dvh] w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="z-20 absolute flex  gap-2  md:top-[20%] top-[18%] right-10">
        <a href="https://villavilla.dk/sommerhusudlejning/lolland-falster-moen/marielyst/222/" target="_blank">
          <Image
            src={"/villavilla-logo.png"}
            alt=""
            className="bg-white p-3"
            height={100}
            width={100}
          />
        </a>
        <a href="https://www.dancenter.com/denmark/rental/falster/marielyst/30772/?persons=15" target="_blank">
          <Image
            src={"/dancenter.png"}
            alt=""
            className="bg-white p-3"
            height={100}
            width={100}
          />
        </a>
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 items-center justify-center text-center h-full px-5">
        <h1 className="text-white text-5xl md:text-8xl max-w-[10ch] font-marcellus font-normal">
          Sommerhus ved Marielyst
        </h1>
        <p className="text-xl text-white">
          Et skridt væk fra hverdagens stress, et skridt ind i sommerhusidyllen
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
