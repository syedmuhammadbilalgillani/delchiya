import Image from "next/image";
import React from "react";
import Text from "./Language/TranslatedText";

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
        <Text
          as="p"
          className="text-end font-la_belle_aurore text-2xl my-2"
          textKey="summerHouseInspiration"
        />
      </div>
      <div className="space-y-10">
        <Text
          as="p"
          className="uppercase text-xs font-medium"
          textKey="summerHouseOffers"
        />

        <Text
          as="h2"
          className="text-3xl md:text-5xl mt-2 mb-4 leading-14"
          textKey="facilitiesTitle"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
          <div className="flex gap-5 items-start">
            <Image
              src={"/swimming-pool-2.svg"}
              alt="home last section"
              width={50}
              height={50}
            />
            <div className="space-y-1">
              <Text
                as="p"
                className="text-black font-marcellus"
                textKey="pool"
              />
              <Text textKey="poolDescription" />
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
              <Text
                as="p"
                className="text-black font-marcellus"
                textKey="caretaker"
              />
              <Text textKey="caretakerDescription" />
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
              <Text
                as="p"
                className="text-black font-marcellus"
                textKey="wifi"
              />
              <Text textKey="wifiDescription" />
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
              <Text
                as="p"
                className="text-black font-marcellus"
                textKey="appliances"
              />
              <Text textKey="appliancesDescription" />
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
              <Text
                as="p"
                className="text-black font-marcellus"
                textKey="tvPackage"
              />
              <Text textKey="tvPackageDescription" />
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
              <Text
                as="p"
                className="text-black font-marcellus"
                textKey="activities"
              />
              <Text textKey="activitiesDescription" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLastSection;
