import HotelDyamic from "@/components/hotel-dynamic";
import Image from "next/image";
import React from "react";

const AboutTheHotel = () => {
  return (
    <>
      <div
        className="bg-center bg-cover min-h-dvh w-full flex justify-center items-center"
        style={{ backgroundImage: "url('/about/about_hero.jpg')" }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <p className="text-white uppercase font-medium">
            Bygget i 2008 Ved Blommestien
          </p>
          <h1 className="text-white md:text-7xl  font-marcellus font-normal">
            Om Blommehuset
          </h1>
          <p className="text-white  text-lg font-medium">
            Stilhed og renhed: Sommerglæder i Marielyst
          </p>
        </div>
      </div>
      <div className="main flex gap-5 flex-col justify-center items-center text-center">
        <Image
          src={"/about/resort.png"}
          alt="resort"
          height={60}
          width={60}
          priority
        />
        <p className="text-green uppercase text-sm font-medium">
          Welkommen til Blommehuset
        </p>
        <h2 className="md:text-5xl text-4xl font-marcellus">
          I Hjertet af Marielyst
        </h2>
        <p className="max-w-xl mx-auto">
          Nær Marielysts skønne strand ligger dette hyggelige Skanlux-poolhus
          med plads til hele familien. Med placering i ferieparadiset Marielyst
          – nær både restauranter, indkøb og strand – er udgangspunktet for en
          god ferie på plads!
        </p>
        <div className="min-h-[80dvh] relative w-full">
          <Image
            src={"/about/2.jpg"}
            alt="hero second image"
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
            className="w-1/2 h-[80%]  my-auto md:left-24 left-0 top-10  absolute object-cover "
            alt=""
          />
          <img
            src={"/about/3.jpg"}
            alt=""
            className="md:w-[60%] w-[70%] absolute h-full right-0 object-cover"
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-4">
          <p className="uppercase font-medium text-xs">Lidt om Sommerhuset</p>
          <h2 className="md:text-5xl text-4xl">Sammenhold og hygge</h2>
          <p className="text-lg">
            Indendørs finder i ligeledes gode rammer for en dejlig ferie. Huset
            byder på både komfort og hygge med rummeligt køkken-alrum, helt egen
            poolafdeling og aktivitetsrum.
          </p>
          <p className="text-lg">
            Husets flotte poolafdeling indeholder pool med vandrutsjebane, et
            dejligt 6-personers spabad samt en stor sauna, hvor feriestemningen
            rigtigt kan sprede sig.
          </p>
          <p className="text-lg">
            I aktivitetsrummet er der ligeledes lagt op til gode timer. Her er
            der ingen undskyldning for at sidde stille, når der både kan dystes
            i bordtennis/billard og dart.
          </p>
        </div>
      </div>
      <div className="main grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center items-start gap-4">
          <p className="uppercase font-medium text-xs">Og lidt mere...</p>
          <h2 className="md:text-5xl text-4xl">Køkken, have og gode nætter</h2>
          <p className="text-lg">
            Køkkenet er åbent og velindrettet, så der uden problemer kan være
            mange kokke og køkkenskrivere om den fælles madlavning.
            Efterfølgende kan måltidet nydes ved det lange spisebord, hvor hele
            flokken kan samles.
          </p>
          <p className="text-lg">
            Den danske sommer kan nydes på terrassen i gode havemøbler, hvor
            også maden kan tilberedes på grill. På den store grund, der
            omkranser huset, er der også tænkt på de mindste gæster med
            sandkasse, legetårn og stor græsplæne.
          </p>
          <p className="text-lg">
            Når alle mand skal sove foregår dette i en af de to soveafdelinger
            med hver 3 dobbeltværelser. De sidste 6 sovepladser finder I på en
            af sommerhusets 2 hemse.
          </p>
        </div>
        <div className="relative flex md:min-h-[80dvh] md:max-h-[80dvh] h-[50dvh] ">
          <img
            src={"/about/4.jpg"}
            className="md:w-1/2 w-[70%] h-[70%] z-[2] my-auto md:right-24 right-0 absolute object-cover "
            alt=""
          />
          <img
            src={"/about/5.jpg"}
            alt=""
            className="md:w-[60%] w-[70%] z-[1]  absolute h-[70%] left-0  bottom-0 object-cover"
          />
        </div>
      </div>
      <div className="main grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-8">
        {[
          {
            src: "/swimming-pool-2.svg",
            alt: "Swimming Pool",
            label: "Swimming Pool",
          },
          {
            src: "/about/laundry-service.png",
            alt: "Vaskemaskine og Tørretromler Pool",
            label: "Vaskemaskine og Tørretromler",
          },
          {
            src: "/customer-service.png",
            alt: "Customer Service",
            label: "Dedikeret Vicevært",
          },
          {
            src: "/coffee-machine.svg",
            alt: "Coffee Machine",
            label: "Kaffe Maskine",
          },
          {
            src: "/wi-fi-icon.svg",
            alt: "Wi-Fi Icon",
            label: "Wifi & Internet",
          },
          {
            src: "/parking.png",
            alt: "Parking",
            label: "Stor parkerings plads",
          },
          { src: "/about/bbq.png", alt: "BBQ", label: "Udendørs Gril" },
          { src: "/stove.svg", alt: "Stove", label: "Brændeovn" },
          {
            src: "/washing-machine.svg",
            alt: "Washing Machine",
            label: "Opvaskemaskine",
          },
          { src: "/smart-tv.svg", alt: "Smart TV", label: "Streaming TV" },
          { src: "/hair-drayer.svg", alt: "Hair Dryer", label: "Hair Dryer" },
          {
            src: "/air-conditioner.svg",
            alt: "Air Conditioner",
            label: "Gulv Varme",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center gap-3"
          >
            <Image src={item.src} alt={item.alt} width={50} height={50} />
            <div>{item.label}</div>
          </div>
        ))}
      </div>

      <div
        className="min-h-[80dvh] relative flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/about/6.jpg')" }}
      >
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
        <div className="relative z-[2] text-center space-y-6 p-6">
          <p className="text-white uppercase text-sm font-medium">Indretning</p>
          <h2 className="font-marcellus md:text-5xl text-4xl text-white">
            Faciliteter indendørs
          </h2>
          <HotelDyamic />
        </div>
      </div>
      <div className="main text-center space-y-6 ">
        <p className="text-sm uppercase font-medium">
          Faciliteter og services​
        </p>
        <h2 className="md:text-5xl text-4xl">Faciliteter og services​</h2>
        <p>
          Sommerhuset tilbyder en bred vifte af faciliteter for både børn,
          voksne og ældre. Uanset om du ønsker at slappe af eller være aktiv, er
          der noget for alle. Indendørs finder du en pool, billardbord,
          airhockey, børnebillard, bordfodbold samt professionelle poker- og
          blackjack-spil. Der er også en stor XL-tv-skærm med Xbox
          Ultimate-pakken og 4 controllere, så hele familien kan spille sammen.
          Udendørs kan du nyde den enorme have, der rummer Blommehusets største
          legeplads – perfekt til sjov og leg. Der er også masser af muligheder
          for haveaktiviteter, herunder vandkamp og meget mere. Huset er også
          tilknyttet en vicevært som vil være til rådighed på næsten alle timer
          af døgnet, samt en pool mand som tjekker poolen 2 gange om ugen. for
          at sikre sig en god og sikker oplevelse for gæsterne.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              img: "/about/c1.jpg",
              label: "Tekniker",
              des: "Vicevært & Pool Mand",
            },
            { img: "/about/c2.jpg", label: "Pool", des: "Spa og Pool" },
            { img: "/about/c3.jpg", label: "XL Skærm", des: "Spil og TV" },
            {
              img: "/about/c4.jpg",
              label: "Legeplads",
              des: "Have og Ude redskaber",
            },
          ].map((item, index) => (
            <div key={index} className="relative group h-[50dvh] overflow-hidden w-full">
              <Image
                src={item?.img}
                alt={item.label}
                fill
                className="h- z-[1] group-hover:scale-110 duration-300 transition-all w-full object-cover object-center"
              />
              <div className="z-[2] bg-gradient-to-t to-transparent from-black/45 group-hover:from-black/30 transition-colors group-hover:to-transparent h-full w-full absolute">
                <div className="border flex flex-col justify-end pb-10 border-yellow m-2 h-[calc(100%-5%)] z-[3] space-y-3">
                  <h3 className="text-white text-3xl">{item.label}</h3>
                  <p className="text-white font-medium text-xs uppercase">{item.des}</p>
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
