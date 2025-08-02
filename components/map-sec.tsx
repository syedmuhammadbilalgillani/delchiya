"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Car, ShoppingCart, Sun, MapPin, LandPlot } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import Image from "next/image";
import Link from "next/link";
const LocationCard = () => {
  const center: LatLngExpression = [55.5, 12.0];

  return (
    <>
      <div className="bg-black text-white p-8  space-y-4 mt-10">
        <p className="text-green text-sm font-medium text-center ">
          EN OPLEVELSE, DER VIL FÅ DIG TIL AT KOMME TILBAGE IGEN OG IGEN.​
        </p>
        <h2 className="text-center md:text-5xl text-4xl mb-10">Lokation</h2>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-10 place-content-center max-w-7xl mx-auto px-10 ">
          {/* Map Section */}
          <div className=" flex justify-center items-center">
            <MapContainer
              center={center}
              zoom={6}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[55.5, 12.0]}>
                <Popup>
                  Blommehuset, Blommestien 3, 4872 Idestrup, Denmark
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Info Section */}
          <div className=" border-2 border-yellow p-10">
            <div className="text-center">
              <p className="text-yellow uppercase">Lokation</p>
              <h3 className="text-3xl font-bold">Blommehuset</h3>
              <p className="text-lg text-white">
                Blommestien 3,
                <br /> 4872 Idestrup,
                <br /> Denmark
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2">
              {/* Supermarket */}
              <div className="flex items-center gap-4">
                <ShoppingCart size={35} className="text-yellow" />
                <div className="text-lg">
                  <div>Supermarket</div>
                  <div>500m til indkøb</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src={"/room-service.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <div>Restaurent</div>
                  <div>1500m til nærmeste restaurant</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src={"/water-waves.png"}
                  alt="room-service"
                  width={30}
                  height={30}
                />
                <div className="text-lg">
                  <div>Stranden</div>
                  <div>700m til stranden</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src={"/golf.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <div>Golf</div>
                  <div>2800m til en golfbane</div>
                </div>
              </div>
            </div>

            {/* Location details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 text-sm">
              <div className="flex items-center gap-4">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <div>København</div>
                  <div>1.5 Timer / 141 KM</div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <div>Odense</div>
                  <div>2 Timer / 182 KM</div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <div>Berlin</div>
                  <div>4,5 Time / 303 KM</div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <div>Hamborg</div>
                  <div>3.5 Time / 227 KM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative bg-gray-200 min-h-dvh pt-10">
        <div className="absolute z-10 top-0 left-0 w-full h-[80dvh] bg-black/50"></div>
        <div
          className="absolute top-0 left-0 w-full h-[80dvh] bg-cover bg-center"
          style={{ backgroundImage: `url("/sea_bg.jpg")` }}
        ></div>
        <div className=" relative z-30  flex flex-col gap-4 text-center justify-center items-center">
          <Image
            src={"/sunrise.png"}
            alt="sunrise"
            width={100}
            height={100}
            className="object-contain"
          />
          <p className="text-white text-lg ">BYEN DER GIVER MINDER </p>
          <h2 className=" md:text-5xl text-4xl text-white ">
            Danmarks Bedste Badestrand
          </h2>
          <p className="text-white text-lg">
            Området omkring Marielyst byder på en væld af oplevelser og
            aktiviteter
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 main z-30 relative">
          <div>
            <div className="relative w-full group">
              <div className="h-[80vh] w-full overflow-hidden">
                <img
                  src="/card1.jpg"
                  className="group-hover:scale-125 transition-all duration-400 w-full h-full object-cover"
                  alt="Image"
                />
              </div>
              <div className="border-2 border-yellow h-[80vh] group-hover:h-[77vh] absolute group-hover:w-[calc(100%-5%)] w-full -top-3 -left-3 group-hover:top-2 group-hover:left-2 transition-all duration-400"></div>
            </div>
            <div className="text-center flex flex-col items-center gap-2 my-2">
              <h3 className="font-medium">Surfcenter Falster </h3>
              <p>
                Surfcenter Falster tilbyder en bred vifte af aktiviteter,
                herunder windsurfing, kitesurfing, SUP (stand-up paddle), og
                kajakroning. Uanset om du er nybegynder eller erfaren, har vi
                udstyr og undervisning tilpasset dit niveau.
              </p>
              <Link className="group " href={"/room/blommehuset"}>
                <div className="flex items-center">
                  Dicover More
                  {/* <span className="group-hover:pl-2  mt-0.5 transition-all">
                    <ChevronRight size={17} />
                  </span> */}
                </div>
                <div className="h-0.5 bg-yellow w-24 group-hover:w-0 transition-all"></div>
              </Link>
            </div>
          </div>
          <div>
            <div className="relative w-full group md:mt-13">
              <div className="h-[80vh] w-full overflow-hidden">
                <img
                  src="/card2.webp"
                  className="group-hover:scale-125 transition-all duration-400 w-full h-full object-cover"
                  alt="Image"
                />
              </div>
              <div className="border-2 border-yellow h-[80vh] group-hover:h-[77vh] absolute group-hover:w-[calc(100%-5%)] w-full -top-3 -left-3 group-hover:top-2 group-hover:left-2 transition-all duration-400"></div>
            </div>
            <div className="text-center flex flex-col items-center gap-2 my-2">
              <h3 className="font-medium">Marielyst - Den gamle badeby</h3>
              <p>
                Marielyst – Den gamle badeby er en charmerende destination med
                mere end 100 års historie. Beliggende på Falster, byder byen på
                en vidunderlig sandstrand, hyggelige caféer, og spændende
                aktiviteter for hele familien. Perfekt til en afslappende ferie
                ved havet!
              </p>
              <Link className="group " href={"/room/blommehuset"}>
                <div className="flex items-center">
                  Dicover More
                  {/* <span className="group-hover:pl-2  mt-0.5 transition-all">
                    <ChevronRight size={17} />
                  </span> */}
                </div>
                <div className="h-0.5 bg-yellow w-24 group-hover:w-0 transition-all"></div>
              </Link>
            </div>
          </div>
          <div>
            <div className="relative w-full group md:mt-8">
              <div className="h-[80vh] w-full overflow-hidden">
                <img
                  src="/card3.jpg"
                  className="group-hover:scale-125 transition-all duration-400 w-full h-full object-cover"
                  alt="Image"
                />
              </div>
              <div className="border-2 border-yellow h-[80vh] group-hover:h-[77vh] absolute group-hover:w-[calc(100%-5%)] w-full -top-3 -left-3 group-hover:top-2 group-hover:left-2 transition-all duration-400"></div>
            </div>
            <div className="text-center flex flex-col items-center gap-2 my-2">
              <h3 className="font-medium">Cykel- og Vandreture</h3>
              <p>
                Udforsk den smukke natur omkring Marielyst med velanlagte cykel-
                og vandreruter gennem skov, marker og langs kysten.
              </p>
              <Link className="group " href={"/room/blommehuset"}>
                <div className="flex items-center">
                  Dicover More
                  {/* <span className="group-hover:pl-2  mt-0.5 transition-all">
                    <ChevronRight size={17} />
                  </span> */}
                </div>
                <div className="h-0.5 bg-yellow w-24 group-hover:w-0 transition-all"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationCard;
