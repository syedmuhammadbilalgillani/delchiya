"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Car, ShoppingCart, Sun, MapPin, LandPlot } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import Image from "next/image";
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
            <div className="mt-8 grid grid-cols-2 text-sm">
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
        <div className="relative z-30">
          <div></div>
        </div>
      </div>
    </>
  );
};

export default LocationCard;
