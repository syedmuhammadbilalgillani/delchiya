import Image from "next/image";
import React from "react";

const HomeLastSection = () => {
  return (
    <div className="px-[7%] py-20 grid grid-cols-1 md:grid-cols-2 gap-9">
      <div>
        <div className="min-h-dvh relative">
          <Image
            src={"/home_last_sec.jpg"}
            alt="home last section"
            fill
            className="h-full w-full"
          />
        </div>
        <p className="text-end font-la_belle_aurore text-2xl my-2">
          Inspireret af dansk sommer, omgivet af naturen, der vægger minder
          mange år frem.
        </p>
      </div>
      <div className="space-y-10">
        <p className="uppercase text-xs font-medium">Sommerhuset Tilbyder</p>
        <h2 className="text-3xl md:text-5xl mt-2 mb-4 leading-14">
          All de nødvendige faciliteter til et hyggeligt og behageligt ophold
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
          <div className="flex gap-5 items-start">
            <Image
              src={"/swimming-pool-2.svg"}
              alt="home last section"
              width={50}
              height={50}
            />

            <div className="space-y-1">
              <p className="text-black font-marcellus ">Pool</p>
              <p>
                18m2 stor pool med rutchebane for de små og en 6 personer
                indendørs spa
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start">
            <Image
              src={"/customer-service.png"}
              alt="home last section"
              width={50}
              height={50}
            />

            <div className="space-y-1">
              <p className="text-black font-marcellus ">Vicevært</p>
              <p>
                En vicevært er tilknyttet sommerhuset og vil være behjælpelig
                med eventuelle problemer, der måtte opstå.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start">
            <Image
              src={"/wi-fi-icon.svg"}
              alt="home last section"
              width={50}
              height={50}
            />

            <div className="space-y-1">
              <p className="text-black font-marcellus ">Wifi & Internet</p>
              <p>Lynhurtig 100 / 100 Forbindelse til den store familie</p>
            </div>
          </div>

          <div className="flex gap-5 items-start">
            <Image
              src={"/washing-machine.svg"}
              alt="home last section"
              width={50}
              height={50}
            />

            <div className="space-y-1">
              <p className="text-black font-marcellus ">
                Alle Fornødne Hvidevare
              </p>
              <p>
                Opvaskemaskine, vaskemaskine, tørretumbler, køleskab og fryser
                er tilgængelige i sommerhuset.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start">
            <Image
              src={"/smart-tv.svg"}
              alt="home last section"
              width={50}
              height={50}
            />

            <div className="space-y-1">
              <p className="text-black font-marcellus ">TV Pakke</p>
              <p>
                Tilbyder et bredt udvalg af populære kanaler, herunder
                underholdning, sport, nyheder og børneprogrammer, noget for hele
                familien.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start">
            <Image
              src={"/table-tennis.svg"}
              alt="home last section"
              width={50}
              height={50}
            />

            <div className="space-y-1">
              <p className="text-black font-marcellus ">
                Billiard / Bordtennis mm.
              </p>
              <p>
                Glæd dig til en bred vifte af sjove og spændende aktiviteter,
                der er skræddersyet til at underholde hele familien og sikre, at
                I får en uforglemmelig tid sammen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLastSection;
