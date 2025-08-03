"use client";
import { EmblaOptionsType } from "embla-carousel";
import React, { Suspense, useEffect, useState } from "react";
import EmblaCarousel from "@/components/embela-carousal/embela-carousal";
import Image from "next/image";

const GalleryPage = ({ data }: { data: any }) => {
//   console.log("Gallery Page Data:", data);
  const [slides, setSlides] = useState([]);
  const OPTIONS: EmblaOptionsType = {
    loop: true,
    direction: "ltr",
  };
  useEffect(() => {
    if (data && data[0]?.images?.da) {
      const mappedSlides = data[0]?.images?.da?.map(
        (item: any, index: number) => ({
          id: index,
          backgroundImage: item?.url || "/placeholder.svg",
        })
      );
    //   console.log("Mapped Slides:", mappedSlides);
      setSlides(mappedSlides);
    }
  }, [data]);
  return (
    <>
      <Suspense>
        <EmblaCarousel slides={slides} options={OPTIONS} />
      </Suspense>
      <div className="main flex flex-col gap-4">
        <p className="text-black">
          Blommehuset i Marielyst er et ideelt sted for en fantastisk
          ferieoplevelse, hvor faciliteterne og beliggenheden kombineres til at
          skabe den perfekte ramme. Placeret i det populære ferieområde
          Marielyst, er dette sommerhus nær restauranter, indkøbsmuligheder og
          stranden, hvilket giver jer alle de nødvendige bekvemmeligheder inden
          for rækkevidde.
        </p>
        <p className="text-black">
          Dette rummelige sommerhus tilbyder en bred vifte af faciliteter, der
          passer til enhver smag og aldersgruppe. Indendørs kan I nyde en privat
          poolafdeling med en 22 m² stor pool, komplet med vandrutsjebane til
          børnene, et rummeligt 6-personers spabad og en stor sauna til
          ultimativ afslapning. Der er også to separate aktivitetsrum, hvor I
          kan udfordre hinanden i forskellige spil som bordtennis, billard og
          dart. Det åbne og velindrettede køkken-alrum giver plads til fælles
          madlavning og hyggelige måltider rundt om det lange spisebord.
        </p>
        <p className="text-black">
          Udendørs er der en stor terrasse med havemøbler og grill, hvor I kan
          nyde de danske sommerdage og lave mad under åben himmel. Den
          omkringliggende grund på 2100 m² er perfekt til børnene, stor
          græsplæne til leg og boldspil.
        </p>
        <p className="text-black">
          Sommerhuset rummer i alt 6 dobbeltværelser og 2 hemse, hvilket giver
          plads til op til 18 personer. Der er også faciliteter til de mindste,
          herunder en barneseng og en høj stol.
        </p>
        <p className="text-black">
          Dette sommerhus er velegnet til forskellige lejligheder, herunder
          familiefødselsdage, konfirmationer, bryllupper og firmaarrangementer.
        </p>
        <h2>Aktiviteter</h2>
        <div className="grid md:grid-cols-3 grid-cols-1  gap-2 mb-10">
          {[
            { icon: "/swimming-pool.svg", label: "Ude og indendørs SPA" },
            {
              icon: "/swimming-pool-2.svg",
              label: "Indendørs Svømming pool",
            },
            { icon: "/air-conditioner.svg", label: "Sauna" },
            { icon: "/base-ball.svg", label: "Billiard" },
            { icon: "/compress.svg", label: "Dart" },
            { icon: "/table-tennis.svg", label: "Bord Tennis" },
          ].map((item: any, index: number) => (
            <div
              key={index}
              className=" p-5 rounded-lg  gap-2 flex items-center"
            >
              <Image
                src={item?.icon}
                alt={item?.label}
                height={50}
                width={50}
                className=""
              />
              <h3 className="text-base font-normal  font-marcellus">
                {item?.label}
              </h3>
            </div>
          ))}
        </div>
        <h2>Inkluderet</h2>
        <div className="grid grid-cols-2  gap-5 mb-10">
          {[
            { icon: "/air-conditioner.svg", label: "Gulv Varme" },
            {
              icon: "/smart-tv.svg",
              label: "Streaming TV",
            },
            { icon: "/wi-fi-icon.svg", label: "Wifi & Internet" },
            { icon: "/hair-drayer.svg", label: "Hår Tørre" },
            {
              icon: "/coffee-machine.svg",
              label: "Espresso / Kaffe Maskine",
            },
            { icon: "/washing-machine.svg", label: "Vaske og Tørre Maskine" },
            { icon: "/washing-machine.svg", label: "Opvaskemaskine" },
            { icon: "/stove.svg", label: "Brændeovn" },
          ].map((item: any, index: number) => (
            <div key={index} className="  gap-2 flex items-center">
              <Image
                src={item?.icon}
                alt={item?.label}
                height={30}
                width={30}
                className="text-yellow-400 fill-current"
              />
              <h3 className="text-base font-normal font-marcellus">
                {item?.label}
              </h3>
            </div>
          ))}
        </div>
        <h2>Afstand til diverse steder</h2>
        <ul className="">
          <li>1.5 km to restaurant</li>
          <li>700 m til stranden</li>
          <li>500 m til indkøbsmuligheder</li>
          <li>2800 m til en golfbane</li>
        </ul>
        <h2>Priser</h2>
        <ul>
          <li>Strøm: 3,40 DKK/kWh</li>
          <li>Vand: 85,00 DKK/m³</li>
          <li>Varme: 2,60 DKK/kWh</li>
          <li>Depositum: 6.000 DKK</li>
        </ul>
      </div>
    </>
  );
};

export default GalleryPage;
