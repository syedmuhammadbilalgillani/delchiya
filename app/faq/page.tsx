"use client";

import Image from "next/image";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FAQ = () => {
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
          <p className="text-white uppercase font-medium">PERFECT HIKING</p>
          <h1 className="text-white md:text-7xl  font-marcellus font-normal">
            FAQ
          </h1>
          <p className="text-white  text-lg font-medium">
            The Andermatt region offers excellent hiking opportunities.
          </p>
        </div>
      </div>
      <div className="main text-center space-y-6 p-6">
        <p>The Amazing Experience</p>
        <h2 className="md:text-5xl text-4xl font-marcellus">
          Diving & Snorkelling
        </h2>
        <p>
          Just a short boat ride from Nanuku’s beach is Beqa Lagoon, home to one
          of the world’s largest barrier reefs. Explore the clear, calm waters,
          where you’ll be able see as far ahead as 100 feet. A spectacular
          underwater world awaits, with beautiful reef formations covered with
          soft corals in nearly every color imaginable, from bright purple and
          vivid orange to mellow olive green. Keep your eyes peeled for abundant
          marine life, including manta rays, hawksbill turtles and schools of
          tropical fish swimming by.
        </p>
        <p>
          Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
          aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
          imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
          mollis pretium. Integer tinci dunt. Cras dapibus. Vivamus elementum
          semper nisi.
        </p>
        <p>Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.</p>
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
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="text-white md:text-5xl text-4xl font-marcellus">
            HIKING TIPS & FAQ
          </h2>
          <p className="text-white  text-lg font-medium">
            Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper
            libero, sit amet adipiscing sem neque sed ipsum.
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
