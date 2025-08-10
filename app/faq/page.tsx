"use client";

import Image from "next/image";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();

  const accordionData = [
    {
      title: "Open Cable Cars Information",
      content:
        "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
    },
    {
      title: "Tour Tips: GPS Download",
      content:
        "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
    },
    {
      title: "Nearby Restaurants and Bars",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    },
    {
      title: "Free Rental of Hiking Poles & Backpacks",
      content: "Content for item 3",
    },
    {
      title: "Amenities and Facilities in the surrounding",
      content: "Content for item 3",
    },
    {
      title: "Refreshing Drinks for the Hike",
      content: "Content for item 3",
    },
    {
      title: "Where and How to Rent Equipment",
      content: "Content for item 3",
    },
    {
      title: "Prices & Reservation",
      content:
        "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
    },
    {
      title: "Cableways Tickets",
      content:
        "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
    },
    {
      title: "Andermatt, Alpine Panorama Tour   ",
      content:
        "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
    },
  ];
  return (
    <>
      <div
        className="bg-center relative bg-cover min-h-dvh w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/faq_hero.jpg')" }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <p className="text-white uppercase font-medium">
            {t("faq_perfect_hiking")}
          </p>
          <h1 className="text-white md:text-7xl font-marcellus font-normal">
            {t("faq_title")}
          </h1>
          <p className="text-white text-lg font-medium">
            {t("faq_hiking_region_description")}
          </p>
        </div>
      </div>
      <div className="main text-center space-y-6 p-6">
        <p>{t("faq_amazing_experience")}</p>
        <h2 className="md:text-5xl text-4xl font-marcellus">
          {t("faq_diving_snorkelling")}
        </h2>
        <p>{t("faq_diving_description_1")}</p>
        <p>{t("faq_diving_description_2")}</p>
        <p>{t("faq_diving_description_3")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-20">
          {[{ image: "/faq1.jpg" }, { image: "/faq2.jpg" }].map(
            (imageObj, index) => (
              <div className="relative min-h-dvh w-full" key={index}>
                <Image
                  src={imageObj.image}
                  fill
                  alt={`image-${index}`}
                  className="h-full w-full object-cover"
                />
              </div>
            )
          )}
        </div>
      </div>
      <div
        className="bg-center bg-cover min-h-[50dvh] relative w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/faq3.jpg')" }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <p className="text-white uppercase font-medium">
            {t("faq_frequently_asked_questions")}
          </p>
          <h2 className="text-white md:text-5xl text-4xl font-marcellus">
            {t("faq_hiking_tips")}
          </h2>
          <p className="text-white text-lg font-medium">
            {t("faq_hiking_description")}
          </p>
        </div>
      </div>
      <div className="main grid grid-cols-1 md:grid-cols-2 gap-x-20">
        {accordionData.map((item, index) => (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="text-xl font-marcellus">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-lg font-jost">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default FAQ;
