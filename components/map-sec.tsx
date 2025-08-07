"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Car, ShoppingCart, Sun, MapPin, LandPlot } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import Image from "next/image";
import Link from "next/link";
import Text from "./Language/TranslatedText";

const customIcon = L.icon({
  iconUrl: "/map-pin.png", // Place your custom marker image in public/map-pin.png
  iconSize: [38, 38], // Adjust size as needed
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
});

const LocationCard = () => {
  const center: LatLngExpression = [54.7055817, -42.8593153];

  return (
    <>
      <div className="bg-black text-white p-8 space-y-4 mt-10">
        <Text
          as="p"
          className="text-green text-sm font-medium text-center"
          textKey="experienceMessage"
        />

        <Text
          className="text-center md:text-5xl text-4xl mb-10"
          as="h2"
          textKey="locationTitle"
        />

        <div className="grid md:grid-cols-2 grid-cols-1 gap-10 place-content-center max-w-7xl mx-auto px-10">
          {/* Map Section */}
          <div className="flex justify-center items-center">
            <MapContainer
              center={center}
              zoom={6}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[54.7055817, -42.8593153]} icon={customIcon}>
                <Popup>
                  <Text textKey="mapLocation" />
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Info Section */}
          <div className="border-2 border-yellow p-10">
            <div className="text-center">
              <Text
                as="p"
                className="text-yellow uppercase"
                textKey="location"
              />

              <Text
                className="text-3xl font-bold"
                as="h3"
                textKey="blommehuset"
              />

              <p className="text-lg text-white">
                <Text textKey="addressLine1" />
                <br />
                <Text textKey="addressLine2" />
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2">
              {/* Supermarket */}
              <div className="flex items-center gap-4">
                <ShoppingCart size={35} className="text-yellow" />
                <div className="text-lg">
                  <Text textKey="supermarket" />{" "}
                  <Text textKey="supermarketDistance" />
                </div>
              </div>
              {/* Restaurant */}
              <div className="flex items-center gap-4">
                <Image
                  src={"/room-service.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <Text textKey="restaurant" />{" "}
                  <Text textKey="restaurantDistance" />
                </div>
              </div>
              {/* Beach */}
              <div className="flex items-center gap-4">
                <Image
                  src={"/water-waves.png"}
                  alt="room-service"
                  width={30}
                  height={30}
                />
                <div className="text-lg">
                  <Text textKey="beach" /> <Text textKey="beachDistance" />
                </div>
              </div>
              {/* Golf */}
              <div className="flex items-center gap-4">
                <Image
                  src={"/golf.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <Text textKey="golf" /> <Text textKey="golfDistance" />
                </div>
              </div>
            </div>

            {/* Location details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 text-sm">
              {/* København */}
              <div className="flex items-center gap-4">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <Text textKey="copenhagen" />{" "}
                  <Text textKey="copenhagenDistance" />
                </div>
              </div>
              {/* Odense */}
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <Text textKey="odense" /> <Text textKey="odenseDistance" />
                </div>
              </div>
              {/* Berlin */}
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <Text textKey="berlin" /> <Text textKey="berlinDistance" />
                </div>
              </div>
              {/* Hamburg */}
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src={"/car.png"}
                  alt="room-service"
                  width={40}
                  height={40}
                />
                <div className="text-lg">
                  <Text textKey="hamburg" /> <Text textKey="hamburgDistance" />
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
        <div className="relative z-30 flex flex-col gap-4 text-center justify-center items-center">
          <Image
            src={"/sunrise.png"}
            alt="sunrise"
            width={100}
            height={100}
            className="object-contain"
          />

          <Text
            as="p"
            className="text-white text-lg"
            textKey="cityThatGivesMemories"
          />

          <Text
            className="md:text-5xl text-4xl text-white"
            textKey="bestBeach"
            as="h2"
          />

          <Text as="p" className="text-white text-lg" textKey="marielystArea" />
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
              <Text
                className="font-medium"
                as="h3"
                textKey="surfCenterFalster"
              />

              <Text as="p" textKey="surfCenterDescription" />

              <Link className="group" href={"/room/blommehuset"}>
                <Text
                  className="flex items-center"
                  as="div"
                  textKey="discoverMore"
                />

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
              <Text
                as="h3"
                className="font-medium"
                textKey="marielystOldBathingTown"
              />

              <Text as="p" textKey="marielystDescription" />

              <Link className="group" href={"/room/blommehuset"}>
                <Text
                  as="div"
                  className="flex items-center"
                  textKey="discoverMore"
                />

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
              <Text as="h3" className="font-medium" textKey="bikeHikingTours" />

              <Text as="p" textKey="bikeHikingDescription" />

              <Link className="group" href={"/room/blommehuset"}>
                <Text
                  as="div"
                  className="flex items-center"
                  textKey="discoverMore"
                />

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
