"use client";
import { EmblaOptionsType } from "embla-carousel";
import React, { Suspense, useEffect, useState } from "react";
import EmblaCarousel from "@/components/embela-carousal/embela-carousal";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const GalleryPage = ({ data }: { data: any }) => {
  const { t } = useTranslation();
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

  const activities = [
    { icon: "/swimming-pool.svg", label: "Outdoor and Indoor SPA" },
    { icon: "/swimming-pool-2.svg", label: "Indoor Swimming Pool" },
    { icon: "/air-conditioner.svg", label: "Sauna" },
    { icon: "/base-ball.svg", label: "Billiard" },
    { icon: "/compress.svg", label: "Dart" },
    { icon: "/table-tennis.svg", label: "Table Tennis" },
  ];

  const included = [
    { icon: "/air-conditioner.svg", label: "Floor Heating" },
    { icon: "/smart-tv.svg", label: "Streaming TV" },
    { icon: "/wi-fi-icon.svg", label: "Wifi & Internet" },
    { icon: "/hair-drayer.svg", label: "Hair Dryer" },
    { icon: "/coffee-machine.svg", label: "Espresso / Coffee Machine" },
    { icon: "/washing-machine.svg", label: "Washing and Drying Machine" },
    { icon: "/washing-machine.svg", label: "Dishwasher" },
    { icon: "/stove.svg", label: "Fireplace" },
  ];
  return (
    <>
      <Suspense>
        <EmblaCarousel slides={slides} options={OPTIONS} />
      </Suspense>
      <div className="main flex flex-col gap-4">
        <p className="text-black">{t("about_blommehuset_description_1")}</p>
        <p className="text-black">{t("about_blommehuset_description_2")}</p>
        <p className="text-black">{t("about_blommehuset_description_3")}</p>
        <p className="text-black">{t("about_blommehuset_description_4")}</p>
        <p className="text-black">{t("about_blommehuset_description_5")}</p>

        <h2>{t("about_activities")}</h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-2 mb-10">
          {activities.map((item, index) => (
            <div key={index} className="p-5 rounded-lg gap-2 flex items-center">
              <Image
                src={item?.icon}
                alt={t(`about_${item.label}`)}
                height={50}
                width={50}
              />
              <h3 className="text-base font-normal font-marcellus">
                {t(`about_${item.label}`)}
              </h3>
            </div>
          ))}
        </div>

        <h2>{t("about_included")}</h2>
        <div className="grid grid-cols-2 gap-5 mb-10">
          {included.map((item, index) => (
            <div key={index} className="gap-2 flex items-center">
              <Image
                src={item?.icon}
                alt={t(`about_${item.label}`)}
                height={30}
                width={30}
                className="text-yellow-400 fill-current"
              />
              <h3 className="text-base font-normal font-marcellus">
                {t(`about_${item.label}`)}
              </h3>
            </div>
          ))}
        </div>

        <h2>{t("about_distance_to_places")}</h2>
        <ul>
          <li>{t("about_distance_to_restaurant")}</li>
          <li>{t("about_distance_to_beach")}</li>
          <li>{t("about_distance_to_shopping")}</li>
          <li>{t("about_distance_to_golf")}</li>
        </ul>

        <h2>{t("about_prices")}</h2>
        <ul>
          <li>{t("about_price_electricity")}</li>
          <li>{t("about_price_water")}</li>
          <li>{t("about_price_heating")}</li>
          <li>{t("about_price_deposit")}</li>
        </ul>
      </div>
    </>
  );
};

export default GalleryPage;
