"use client";

import Image from "next/image";
import Text from "./Language/TranslatedText";

const HeroSection = () => {
  return (
    <div
      className="relative  h-[80dvh] max-sm:h-[90dvh] w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="z-20 absolute  md:top-[20%] bg-black/70 top-[15%] right-10   p-2 ">
        <Text
          as="p"
          textKey="availableVia"
          className="text-white uppercase text-center text-sm mb-3 "
        />

        <div className="flex  gap-2 ">
          <a
            href="https://villavilla.dk/sommerhusudlejning/lolland-falster-moen/marielyst/222/"
            target="_blank"
          >
            <Image
              src={"/villavilla-logo.png"}
              alt="villavilla"
              className=" p-3"
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
      <div className="relative z-10 mt-5 md:mt-0 flex flex-col gap-6 items-center justify-center text-center h-full px-5">
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
