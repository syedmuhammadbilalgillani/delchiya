"use client";
import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./dots";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";

import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SlideType = {
  id: number;
  backgroundImage: string;
};

type PropType = {
  slides: SlideType[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(), Fade()]);
  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  console.log(slides, "slides");
  return (
    <>
      <style jsx>
        {`
          .slider-container {
            --slide-size: 100%;
          }
          .content-container {
            display: flex;
            touch-action: pan-y pinch-zoom;
            margin-left: calc(var(--slide-spacing) * -1);
          }
          .slide {
            transform: translate3d(0, 0, 0);
            flex: 0 0 var(--slide-size);
            min-width: 0;
            padding-left: var(--slide-spacing);
          }
          .embla__dot:after {
            box-shadow: inset 0 0 0 0.2rem #ccc;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            display: flex;
            content: "";
          }

          .embla__dot--selected:after {
            box-shadow: inset 0 0 0 0.2rem rgb(47, 166, 222);
          }
        `}
      </style>
      <section className="max-w-full m-auto slider-container relative">
        <div className=" overflow-hidden md:h-[90dvh] h-[40dvh]" ref={emblaRef}>
          <div className="content-container">
            {slides?.map((slide) => (
              <div
                className="slide relative md:h-[90dvh] h-[40dvh] w-full "
                key={slide.id}
              >
                <Image
                  src={slide.backgroundImage}
                  className="h-full w-full object-cover object-center"
                  fill
                  alt=""
                  priority
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 flex justify-between w-full px-10">
          <button
            className="h-16  w-16 rounded-full md:bg-white cursor-pointer flex justify-center items-center"
            onClick={scrollPrev}
          >
            <ArrowLeft className="md:text-black text-white" />
          </button>
          <button
            className="h-16  w-16 rounded-full md:bg-white cursor-pointer flex justify-center items-center"
            onClick={scrollNext}
          >
            <ArrowRight className="md:text-black text-white" />
          </button>
        </div>
        {/* <div className="embla__controls absolute bottom-10 md:left-10 right-10 ">
          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? " embla__dot--selected" : ""
                )}
              />
            ))}
          </div>
        </div> */}
      </section>
    </>
  );
};

export default EmblaCarousel;
