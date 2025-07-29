"use client";
import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "../embela-carousal/dots";
import Image from "next/image";

type PropType = {
  slides: {
    id: number;
    backgroundImage: string;
  }[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

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

  return (
    <>
      <style jsx>
        {`
          .embla {
            margin: auto;
            --slide-height: 80dvh;
            --slide-spacing: 1rem;
            --slide-size: 33%;
          }
          .embla__viewport {
            overflow: hidden;
          }
          .embla__container {
            display: flex;
            touch-action: pan-y pinch-zoom;
            margin-left: calc(var(--slide-spacing) * -1);
          }
          .embla__slide {
            transform: translate3d(0, 0, 0);
            flex: 0 0 var(--slide-size);
            min-width: 0;
            padding-left: var(--slide-spacing);
          }
          .embla__slide__number {
            box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
            border-radius: 1.8rem;
            font-size: 4rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            height: var(--slide-height);
            user-select: none;
          }
          .embla__controls {
            display: grid;
            grid-template-columns: auto 1fr;
            justify-content: space-between;
            gap: 1.2rem;
            margin-top: 1.8rem;
          }
          .embla__dots {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            align-items: center;
            margin-right: calc((2.6rem - 1.4rem) / 2 * -1);
          }
          .embla__dot {
            -webkit-tap-highlight-color: rgba(
              var(--text-high-contrast-rgb-value),
              0.5
            );
            -webkit-appearance: none;
            appearance: none;
            background-color: transparent;
            touch-action: manipulation;
            display: inline-flex;
            text-decoration: none;
            cursor: pointer;
            border: 0;
            padding: 0;
            margin: 0;
            width: 2.6rem;
            height: 2.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          .embla__dot:after {
            box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
            width: 1.4rem;
            height: 1.4rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            content: "";
          }
          .embla__dot--selected:after {
            box-shadow: inset 0 0 0 0.2rem var(--text-body);
            /* Responsive Design */
            @media (min-width: 768px) {
              /* Medium screens: 2 slides per view */
              .embla {
                --slide-size: 50%;
              }
            }
          }

          //   @media (min-width: 1024px) {
          //     /* Large screens: 3 slides per view */
          //     .embla {
          //       --slide-size: 33%;
          //     }
          //   }

          @media (max-width: 767px) {
            /* Small screens: 1 slide per view */
            .embla {
              --slide-size: 50%;
            }
          }
          @media (max-width: 600px) {
            /* Small screens: 1 slide per view */
            .embla {
              --slide-size: 100%;
            }
          }
        `}
      </style>

      <section className="embla main">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((item, index) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__number relative">
                  <Image
                    src={item?.backgroundImage}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    fill
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="embla__controls">
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
          </div>
        </div>
      </section>
    </>
  );
};

export default EmblaCarousel;
