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
          <h2 className="text-5xl">Sammenhold og hygge</h2>
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
          <h2 className="text-5xl">Køkken, have og gode nætter</h2>
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
        <div className="relative flex min-h-[70dvh] max-h-[80dvh] ">
          <img
            src={"/about/4.jpg"}
            className="w-1/2 h-[70%] z-[2] my-auto md:right-24 right-0 absolute object-cover "
            alt=""
          />
          <img
            src={"/about/5.jpg"}
            alt=""
            className="md:w-[60%] w-[70%] z-[1]  absolute h-[70%] left-0  bottom-0 object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default AboutTheHotel;
