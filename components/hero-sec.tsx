"use client";

import Image from "next/image";
import Text from "./Language/TranslatedText";

const HeroSection = () => {
  return (
    <div className="relative h-[80dvh] max-sm:h-[75dvh] w-full">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://res.cloudinary.com/djtsygofv/video/upload/v1755123261/delchiya.mp4_i2mqaz.mov"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="z-20 absolute md:top-[18%] bg-black/25 top-[12%] md:right-3 right-2 md:p-2 p-1">
        <Text
          as="p"
          textKey="availableVia"
          className="text-white uppercase text-center text-sm md:mb-3 mb-1"
        />

        <div className="flex gap-2">
          <a
            href="https://villavilla.dk/sommerhusudlejning/lolland-falster-moen/marielyst/222/"
            target="_blank"
          >
            <img
              src={"/villavilla-logo.png"}
              alt="villavilla"
              className="md:p-3"
              height={100}
              width={100}
            />
          </a>
          <a
            href="https://www.dancenter.com/denmark/rental/falster/marielyst/30772/?persons=15"
            target="_blank"
          >
            <Image
              src={"/dancenter.png"}
              alt="dancenter"
              className=""
              height={120}
              width={120}
            />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 md:pt-0 flex flex-col gap-6 items-center justify-center text-center h-full px-5">
        <Text
          as="h1"
          className="text-white text-5xl md:text-8xl max-w-[10ch] font-marcellus font-normal"
          textKey="headline"
        />

        <Text as="p" className="text-xl text-white" textKey="subheadline" />
      </div>
    </div>
  );
};

export default HeroSection;
