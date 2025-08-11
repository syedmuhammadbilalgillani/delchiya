import EmblaCarousel from "@/components/embela-slider/embela-slider";
import HeroSection from "@/components/hero-sec";
import RoomCard from "@/components/room-card";
import Structure from "@/components/structure";
import VideoDialog from "@/components/video-dialogue";

import FilterSection from "@/components/filter-section";
import GUEST_EXPERIENCES from "@/components/guest-experience";
import HomeLastSection from "@/components/home_last_sec";
import Text from "@/components/Language/TranslatedText";
import Location from "@/components/location";
import Image from "next/image";
export const dynamic = "force-dynamic";

const page = () => {
  const productSlides = [
    { id: 1, backgroundImage: "/hero/1.jpg" },
    { id: 2, backgroundImage: "/hero/2.jpg" },
    { id: 3, backgroundImage: "/hero/3.jpg" },
    { id: 4, backgroundImage: "/hero/4.jpg" },
    { id: 5, backgroundImage: "/hero/5.jpg" },
  ];

  return (
    <>
      <HeroSection />
      <FilterSection />{" "}
      <div className="flex flex-col justify-center items-center main max-w-3xl text-center gap-6">
        <Image
          src={"/stay-house.svg"}
          alt="stay-house"
          height={60}
          width={60}
        />
        <Text as="p" textKey="welcomeMessage" />

        <Text
          textKey="locationHeader"
          className="md:text-5xl text-4xl text-green"
          as="h2"
        />

        <Text as="p" textKey="descriptionText" />
      </div>
      <EmblaCarousel slides={productSlides} />
      <div className="main">
        <Text
          as="div"
          className="font-la_belle_aurore! text-2xl"
          textKey="luxuryExperience"
        />
      </div>
      <VideoDialog />
      <Structure />
      <RoomCard />
      <Location />
      <GUEST_EXPERIENCES />
      <HomeLastSection />
    </>
  );
};

export default page;
