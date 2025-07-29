import EmblaCarousel from "@/components/embela-slider/embela-slider";
import FilterSection from "@/components/filter-section";
import HeroSection from "@/components/hero-sec";
import RoomCard from "@/components/room-card";
import Structure from "@/components/structure";
import VideoDialog from "@/components/video-dialogue";

import Image from "next/image";

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
      <HeroSection />;{/* <FilterSection /> */}
      <div className="flex flex-col justify-center items-center main max-w-3xl text-center gap-6">
        <Image
          src={"/stay-house.svg"}
          alt="stay-house"
          height={60}
          width={60}
        />
        <p>Welkommen til blommehuset</p>
        <h2 className="text-5xl text-green">
          Beliggende i hjertet af det smukkeste Marielyst
        </h2>
        <p>
          En afslappende og mindeværdige ophold for familier, venner og alle,
          der søger en pause fra hverdagens travlhed. Blommehuset er det ideelle
          tilflugtssted, hvor moderne komfort møder naturskønne omgivelser. Med
          sin charmerende atmosfære og bekvemmelige faciliteter giver det dig
          mulighed for at nyde alt, hvad Marielyst har at byde på.
        </p>
      </div>
      <EmblaCarousel slides={productSlides} />
      <div className="main">
        <div className="font-la_belle_aurore! text-2xl">
          Inspireret af dansk luksus og omgivet af naturskønne omgivelser, er
          vores sommerhus designet til at tilbyde en uforglemmelig oplevelse.
          Fra afslappende stunder i naturen til spændende aktiviteter, er vores
          mål at holde dig underholdt og forkælet under hele dit ophold.
        </div>
      </div>
      <VideoDialog />
      <Structure />
      <RoomCard />
    </>
  );
};

export default page;
