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
import { useTranslation } from "react-i18next";
export const dynamic = "force-dynamic";

const RoomPage = () => {
  const searchParams = useSearchParams();
  const arrival = searchParams.get("checkin");
  const departure = searchParams.get("checkout");
  const [houseData, setHouseData] = useState<any>(null); // Initialize with null to indicate data is not yet loaded
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  const [error, setError] = useState("");
  const [slides, setSlides] = useState<any[]>([]); // Separate state for slides
  const [isMounted, setisMounted] = useState(false);
  const { t } = useTranslation();

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
      <div className="text-gray-500  flex justify-center items-center min-h-dvh relative z-50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!isMounted) return null;

  const OPTIONS: EmblaOptionsType = {
    loop: true,
    direction: "ltr",
  };

  const activities = [
    { icon: "/swimming-pool.svg", label: "activity_spa" },
    { icon: "/swimming-pool-2.svg", label: "activity_indoor_pool" },
    { icon: "/air-conditioner.svg", label: "activity_sauna" },
    { icon: "/base-ball.svg", label: "activity_billiard" },
    { icon: "/compress.svg", label: "activity_dart" },
    { icon: "/table-tennis.svg", label: "activity_table_tennis" },
  ];

  const included = [
    { icon: "/air-conditioner.svg", label: "included_floor_heating" },
    { icon: "/smart-tv.svg", label: "included_streaming_tv" },
    { icon: "/wi-fi-icon.svg", label: "included_wifi_internet" },
    { icon: "/hair-drayer.svg", label: "included_hair_dryer" },
    { icon: "/coffee-machine.svg", label: "included_coffee_machine" },
    { icon: "/washing-machine.svg", label: "included_washing_dryer_machine" },
    { icon: "/washing-machine.svg", label: "included_dishwasher" },
    { icon: "/stove.svg", label: "included_fireplace" },
  ];
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
          <h1>{t("house_name")}</h1>
          <p className="text-gray-500">
            {t("indoor_pool")} / {t("spa")} / {t("sauna")} /{" "}
            {t("activity_room")}
          </p>

          <div className="flex gap-x-10 gap-y-2 flex-wrap ">
            <div className="flex items-center gap-1">
              <Maximize2 />
              {houseData[0]?.info?.land_area?.value || ""}{" "}
              {houseData[0]?.info?.land_area?.units || ""}
            </div>
            <div className="flex items-center gap-1">
              <Users />
              {houseData[0]?.info?.persons || ""} {t("guests")}
            </div>
            <div className="flex items-center gap-1">
              <PawPrint /> {houseData[0]?.info?.bathrooms || ""}{" "}
              {t("pets_allowed")}
            </div>
            <div className="flex items-center gap-1">
              <Bath /> {t("bathrooms")}
            </div>
            <div className="flex items-center gap-1">
              <BedDouble /> {houseData[0]?.info?.bedrooms || ""} {t("bedrooms")}
            </div>
            <div className="flex items-center gap-1">
              <img src="/pillows.png" alt="pillow" className="size-8" /> 2{" "}
              {t("lofts")}
            </div>
            <div className="flex items-center gap-1">
              <Zap />
              {t("energy_friendly")}
            </div>
          </div>

          <p>{t("house_description_1")}</p>
          <p>{t("house_description_2")}</p>
          <p>{t("house_description_3")}</p>
          <p>{t("house_description_4")}</p>
          <p>{t("house_description_5")}</p>
          <h2>{t("activitiess")}</h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mb-10">
            {activities.map((item, index) => (
              <div
                key={index}
                className="bg-[#FAF7F4] p-5 rounded-lg gap-2 flex items-center"
              >
                <Image
                  src={item?.icon}
                  alt={t(item?.label)}
                  height={30}
                  width={30}
                  className="text-yellow-400 fill-current"
                />
                <h3 className="text-base font-normal font-marcellus">
                  {t(item?.label)}
                </h3>
              </div>
            ))}
          </div>

          <h2>{t("included")}</h2>
          <div className="grid grid-cols-2 gap-5 mb-10">
            {included.map((item, index) => (
              <div key={index} className="gap-2 flex items-center">
                <Image
                  src={item?.icon}
                  alt={t(item?.label)}
                  height={30}
                  width={30}
                  className="text-yellow-400 fill-current"
                />
                <h3 className="text-base font-normal font-marcellus">
                  {t(item?.label)}
                </h3>
              </div>
            ))}
          </div>
          <h2>{t("distance_to_places")}</h2>
          <ul>
            <li>{t("distance_to_restaurant")}</li>
            <li>{t("distance_to_beach")}</li>
            <li>{t("distance_to_shopping")}</li>
            <li>{t("distance_to_golf")}</li>
          </ul>

          <h2>{t("prices")}</h2>
          <ul>
            <li>{t("electricity_price")}</li>
            <li>{t("water_price")}</li>
            <li>{t("heating_price")}</li>
            <li>{t("deposit_price")}</li>
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
