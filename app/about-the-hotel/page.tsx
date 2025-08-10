"use client";
import HotelDyamic from "@/components/hotel-dynamic";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const AboutTheHotel = () => {
  const { t } = useTranslation();
  const amenities = [
    {
      src: "/swimming-pool-2.svg",
      alt: "Swimming Pool",
      label: "Swimming Pool",
    },
    {
      src: "/about/laundry-service.png",
      alt: "Washing Machine and Dryer",
      label: "Washing Machine and Dryer",
    },
    {
      src: "/customer-service.png",
      alt: "Dedicated Caretaker",
      label: "Dedicated Caretaker",
    },
    {
      src: "/coffee-machine.svg",
      alt: "Coffee Machine",
      label: "Coffee Machine",
    },
    {
      src: "/wi-fi-icon.svg",
      alt: "Wi-Fi Icon",
      label: "Wifi & Internet",
    },
    {
      src: "/parking.png",
      alt: "Parking",
      label: "Large Parking Space",
    },
    {
      src: "/about/bbq.png",
      alt: "BBQ",
      label: "Outdoor Grill",
    },
    {
      src: "/stove.svg",
      alt: "Stove",
      label: "Fireplace",
    },
    {
      src: "/washing-machine.svg",
      alt: "Dishwasher",
      label: "Dishwasher",
    },
    {
      src: "/smart-tv.svg",
      alt: "Smart TV",
      label: "Streaming TV",
    },
    {
      src: "/hair-drayer.svg",
      alt: "Hair Dryer",
      label: "Hair Dryer",
    },
    {
      src: "/air-conditioner.svg",
      alt: "Floor Heating",
      label: "Floor Heating",
    },
  ];
  const services = [
    {
      img: "/about/c1.jpg",
      label: "Technician",
      des: "Caretaker & Pool Man",
    },
    { img: "/about/c2.jpg", label: "Pool", des: "Spa and Pool" },
    { img: "/about/c3.jpg", label: "XL Screen", des: "Games and TV" },
    {
      img: "/about/c4.jpg",
      label: "Playground",
      des: "Garden and Outdoor Tools",
    },
  ];
  return (
    <>
      <div
        className="bg-center bg-cover min-h-dvh w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/about/about_hero.jpg')" }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <p className="text-white uppercase font-medium">
            {t("about_description")}
          </p>
          <h1 className="text-white md:text-7xl font-marcellus font-normal">
            {t("about_title")}
          </h1>
          <p className="text-white text-lg font-medium">
            {t("about_subtitle")}
          </p>
        </div>
      </div>
      <div className="main flex gap-5 flex-col justify-center items-center text-center">
        <Image
          src={"/about/resort.png"}
          alt={t("about_resort_alt")}
          height={60}
          width={60}
          priority
        />
        <p className="text-green uppercase text-sm font-medium">
          {t("about_welcome_text")}
        </p>
        <h2 className="md:text-5xl text-4xl font-marcellus">
          {t("about_title_location")}
        </h2>
        <p className="max-w-xl mx-auto">{t("about_paragraph")}</p>
        <div className="min-h-[80dvh] relative w-full">
          <Image
            src={"/about/2.jpg"}
            alt={t("about_hero_second_image_alt")}
            fill
            priority
            className="object-cover object-center h-full w-full"
          />
        </div>
      </div>
      <div className="main grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative flex md:min-h-[70dvh] md:max-h-[70dvh] min-h-[50dvh]">
          <img
            src={"/home_last_sec.jpg"}
            className="w-1/2 h-[80%] my-auto md:left-24 left-0 top-10 absolute object-cover"
            alt={t("about_image_alt_1")}
          />
          <img
            src={"/about/3.jpg"}
            alt={t("about_image_alt_2")}
            className="md:w-[60%] w-[70%] absolute h-full right-0 object-cover"
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-4">
          <p className="uppercase font-medium text-xs">
            {t("about_summer_house_info")}
          </p>
          <h2 className="md:text-5xl text-4xl">
            {t("about_title_togetherness")}
          </h2>
          <p className="text-lg">{t("about_paragraph_1")}</p>
          <p className="text-lg">{t("about_paragraph_2")}</p>
          <p className="text-lg">{t("about_paragraph_3")}</p>
        </div>
      </div>
      <div className="main grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center items-start gap-4">
          <p className="uppercase font-medium text-xs">
            {t("about_more_info")}
          </p>
          <h2 className="md:text-5xl text-4xl">
            {t("about_kitchen_garden_title")}
          </h2>
          <p className="text-lg">{t("about_kitchen_paragraph_1")}</p>
          <p className="text-lg">{t("about_kitchen_paragraph_2")}</p>
          <p className="text-lg">{t("about_kitchen_paragraph_3")}</p>
        </div>
        <div className="relative flex md:min-h-[80dvh] md:max-h-[80dvh] h-[50dvh]">
          <img
            src={"/about/4.jpg"}
            className="md:w-1/2 w-[70%] h-[70%] z-[2] my-auto md:right-24 right-0 absolute object-cover"
            alt={t("about_image_alt_3")}
          />
          <img
            src={"/about/5.jpg"}
            alt={t("about_image_alt_4")}
            className="md:w-[60%] w-[70%] z-[1] absolute h-[70%] left-0 bottom-0 object-cover"
          />
        </div>
      </div>
      <div className="main grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-8">
        {amenities.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center gap-3"
          >
            <Image src={item.src} alt={t(item.alt)} width={50} height={50} />
            <div>{t(`about_${item.label}`)}</div>
          </div>
        ))}
      </div>

      <div
        className="min-h-[80dvh] relative flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/about/6.jpg')" }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <p className="text-white uppercase text-sm font-medium">
            {t("about_indoor_furnishing")}
          </p>
          <h2 className="font-marcellus md:text-5xl text-4xl text-white">
            {t("about_indoor_facilities")}
          </h2>
          <HotelDyamic />
        </div>
      </div>
      <div className="main text-center space-y-6 ">
        <p className="text-sm uppercase font-medium">
          {t("about_facilities_and_services")}
        </p>
        <h2 className="md:text-5xl text-4xl">
          {t("about_facilities_and_services")}
        </h2>
        <p>{t("about_facilities_description")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="relative group h-[50dvh] overflow-hidden w-full"
            >
              <Image
                src={item?.img}
                alt={t(`about_${item.label}`)}
                fill
                className="h- z-[1] group-hover:scale-110 duration-300 transition-all w-full object-cover object-center"
              />
              <div className="z-[2] bg-gradient-to-t to-transparent from-black/45 group-hover:from-black/10 transition-colors group-hover:to-transparent h-full w-full absolute">
                <div className="border flex flex-col justify-end pb-10 border-yellow m-2 h-[calc(100%-5%)] z-[3] space-y-3">
                  <h3 className="text-white text-3xl">
                    {t(`about_${item.label}`)}
                  </h3>
                  <p className="text-white font-medium text-xs uppercase">
                    {t(`about_${item.des}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutTheHotel;
