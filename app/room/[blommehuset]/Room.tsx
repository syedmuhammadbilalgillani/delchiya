"use client";
import EmblaCarousel from "@/components/embela-carousal/embela-carousal";
import RoomPageFilter from "@/components/room-page-filter";
import axios from "axios";
import { EmblaOptionsType } from "embla-carousel";
import {
  Bath,
  BedDouble,
  Loader2,
  Maximize2,
  PawPrint,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const RoomPage = () => {
  const searchParams = useSearchParams();
  const arrival = searchParams.get("checkin");
  const departure = searchParams.get("checkout");
  const [houseData, setHouseData] = useState<any>(null); // Initialize with null to indicate data is not yet loaded
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  const [error, setError] = useState("");
  const [slides, setSlides] = useState<any[]>([]); // Separate state for slides
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);

  useEffect(() => {
    axios
      .get("https://api.villavilla.com/partner-api/v1/houses/?house_id=122", {
        headers: {
          Authorization:
            "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
        },
      })
      .then((response) => {
        setHouseData(response?.data);
      })
      .catch((err) => {
        setError("Failed to fetch house data");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!arrival || !departure) return;

    axios
      .get(
        `https://api.villavilla.com/partner-api/v1/period?house_id=122&arrival=${arrival}&departure=${departure}&currency_code=208`,
        {
          headers: {
            Authorization:
              "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
          },
        }
      )
      .then((response) => {
        // debugger;

        setAvailabilityData(response.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          const errors = err.response.data.errors;

          // Convert errors to a flat message string or array
          const errorMessages = Object.entries(errors).flatMap(
            ([field, messages]: [field: any, message: any]) =>
              messages?.map((msg: any) => `${field}: ${msg}`)
          );

          console.error("Validation errors:", errorMessages);
          setError(errorMessages.join(" | "));
        } else {
          console.error("Unexpected error:", err);
          setError("Failed to fetch availability data");
        }
      });
  }, [arrival, departure]); // 👈 this line is important

  useEffect(() => {
    if (houseData && houseData[0]?.images?.da) {
      const mappedSlides = houseData[0]?.images?.da?.map(
        (item: any, index: number) => ({
          id: index,
          backgroundImage: item?.url || "/placeholder.svg",
        })
      );
      setSlides(mappedSlides);
    }
  }, [houseData]); // Update slides when houseData changes

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-dvh uppercase">
        {error}
      </div>
    );
  }
  if (!houseData || !Array.isArray(houseData) || houseData.length === 0) {
    return (
      <div className="text-gray-500 flex justify-center items-center min-h-dvh relative z-50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!isMounted) return null;

  const OPTIONS: EmblaOptionsType = {
    loop: true,
    direction: "ltr",
  };

  console.log(houseData, "houseData");
  return (
    <div>
      <Suspense>
        <EmblaCarousel slides={slides} options={OPTIONS} />
      </Suspense>

      <div className="grid grid-cols-8 p-[5%] gap-10 font-marcellus">
        <div className="md:col-span-3 col-span-full block md:hidden ">
          <RoomPageFilter price={availabilityData?.pricing} />
        </div>
        <div className="md:col-span-5 col-span-full space-y-3 ">
          <h1>Blommehuset</h1>
          <p className="text-gray-500">
            Indendørs Pool / Inde og ude spa / Sauna / Aktivitetsrum
          </p>

          <div className="flex gap-x-10 gap-y-2 flex-wrap ">
            <div className="flex items-center gap-1">
              <Maximize2 />
              {houseData[0]?.info?.land_area?.value || ""}
              {houseData[0]?.info?.land_area?.units || ""}
            </div>
            <div className="flex items-center gap-1">
              <Users />
              {houseData[0]?.info?.persons || ""} Gæster
            </div>
            <div className="flex items-center gap-1">
              <PawPrint /> {houseData[0]?.info?.bathrooms || ""} Husdyr tilladt
            </div>
            <div className="flex items-center gap-1">
              <Bath /> Badeværelser
            </div>
            <div className="flex items-center gap-1">
              <BedDouble /> {houseData[0]?.info?.bedrooms || ""} Værelser
            </div>
            <div className="flex items-center gap-1">
              <img src="/pillows.png" alt="pillow" className="size-8" /> 2 Hems
            </div>
            <div className="flex items-center gap-1">
              <Zap />
              Energi Venlig
            </div>
          </div>

          <p>
            Blommehuset i Marielyst er et ideelt sted for en fantastisk
            ferieoplevelse, hvor faciliteterne og beliggenheden kombineres til
            at skabe den perfekte ramme. Placeret i det populære ferieområde
            Marielyst, er dette sommerhus nær restauranter, indkøbsmuligheder og
            stranden, hvilket giver jer alle de nødvendige bekvemmeligheder
            inden for rækkevidde.
          </p>
          <p>
            Dette rummelige sommerhus tilbyder en bred vifte af faciliteter, der
            passer til enhver smag og aldersgruppe. Indendørs kan I nyde en
            privat poolafdeling med en 22 m² stor pool, komplet med
            vandrutsjebane til børnene, et rummeligt 6-personers spabad og en
            stor sauna til ultimativ afslapning. Der er også to separate
            aktivitetsrum, hvor I kan udfordre hinanden i forskellige spil som
            bordtennis, billard og dart. Det åbne og velindrettede køkken-alrum
            giver plads til fælles madlavning og hyggelige måltider rundt om det
            lange spisebord.
          </p>
          <p>
            Udendørs er der en stor terrasse med havemøbler og grill, hvor I kan
            nyde de danske sommerdage og lave mad under åben himmel. Den
            omkringliggende grund på 2100 m² er perfekt til børnene, stor
            græsplæne til leg og boldspil.
          </p>
          <p>
            Sommerhuset rummer i alt 6 dobbeltværelser og 2 hemse, hvilket giver
            plads til op til 18 personer. Der er også faciliteter til de
            mindste, herunder en barneseng og en høj stol.
          </p>
          <p>
            Dette sommerhus er velegnet til forskellige lejligheder, herunder
            familiefødselsdage, konfirmationer, bryllupper og
            firmaarrangementer.
          </p>
          <h2>Aktiviteter</h2>
          <div className="grid md:grid-cols-3 grid-cols-1  gap-5 mb-10">
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
                className="bg-[#FAF7F4] p-5 rounded-lg  gap-2 flex items-center"
              >
                <Image
                  src={item?.icon}
                  alt={item?.label}
                  height={30}
                  width={30}
                  className="text-yellow-400 fill-current"
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
        <div className="col-span-3 md:block hidden">
          <RoomPageFilter price={availabilityData?.pricing} />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
