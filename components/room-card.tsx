import { Maximize2, PawPrint, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

const RoomCard = () => {
  return (
    <div className=" md:max-w-[404px]  mx-auto space-y-3 px-5">
      <div className="uppercase text-sm font-medium  text-center text-green">
        Sommerhuset Hvor Luksus forenes med naturen
      </div>
      <h2 className="md:text-5xl text-4xl  text-center">Blommehuset</h2>
      <div className=" md:w-[404px] md:h-[404px] max-w-[303px] mx-auto">
        {/* Set a fixed aspect ratio container */}
        <div className="relative md:w-[404px] md:h-[404px] w-[303px] h-[303px] mx-auto">
          <Image
            src="/room.jpg"
            alt="Plantegning"
            fill
            className="object-cover object-center"
          />
          <div className="inset-0 top-3 left-3 bg-white text-black z-10 absolute w-fit h-fit px-3 py-2 text-sm">
            FRA 5,000KR
          </div>
        </div>
        <h3 className="text-start mt-3 ">Blommehuset</h3>
        <div className="flex gap-x-10 gap-y-2 flex-wrap my-3 ">
          <div className="flex items-center gap-1">
            <Maximize2 />
            210 m2
          </div>
          <div className="flex items-center gap-1">
            <Users />
            18 Gæster
          </div>
          <div className="flex items-center gap-1">
            <PawPrint /> Husdyr tilladt
          </div>
        </div>
        <p>
          Blommehuset i Marielyst er et ideelt sted for en fantastisk
          ferieoplevelse, hvor faciliteterne og beliggenheden kombineres til at
          skabe den perfekte ramme. Placeret i det …
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
