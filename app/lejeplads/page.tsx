"use client";
import Text from "@/components/Language/TranslatedText";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (element: HTMLElement, config: any) => any;
    };
  }
}
const Lejeplads = () => {
  const iframeRef = useRef<any>(null);
  const playerRef = useRef<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Load the YouTube IFrame API script
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);

    // Initialize the YouTube player once the API script is loaded
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: "GRFKeCRoZco",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          loop: 1,
          playlist: "GRFKeCRoZco", // Make the video loop
        },
      });
    };

    return () => {
      // Clean up the iframe player when the component is unmounted
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const handleMuteToggle = () => {
    if (playerRef.current) {
      const isMuted = playerRef.current.isMuted();
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
    }
  };

  return (
    <div className="relative">
      <div className="relative h-full w-full">
        {/* Overlay */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/60 "
          style={{
            zIndex: 1, // Overlay on top of the iframe but below the text
          }}
        ></div>

        {/* Content Section */}
        <div className="absolute z-20 pt-24 md:pt-0 flex left-1/2  -translate-x-1/2 flex-col gap-6 items-center justify-center text-center h-full px-5">
          <Text
            as="p"
            className="text-base text-white capitalize w-[30ch]"
            textKey="gatherFamily"
          />
          <Text
            as="h1"
            className="text-white text-5xl md:text-7xl font-marcellus font-normal"
            textKey="bigScreen"
          />
        </div>

        {/* Iframe */}
        <div
          aria-hidden="true"
          style={{
            transform: "translate3d(0px, 0px, 0px)",
            WebkitTransform: "translate3d(0px, 0px, 0px)",
            height: "80dvh",
            // marginTop: "-60px",
          }}
        >
          <div
            ref={iframeRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0, // Set iframe z-index to 0
            }}
          ></div>
        </div>
      </div>
      <div className="grid md:grid-cols-8 grid-cols-1 main gap-5">
        <div className="col-span-6 space-y-5">
          <p className="text-green text-lg">{t("fantasticExperience")}</p>
          <h2 className="md:text-5xl text-4xl">{t("tvTitle")}</h2>
          <p className="text-lg">{t("tvDesc1")}</p>
          <p className="text-lg">{t("tvDesc2")}</p>
          <p className="text-lg">{t("tvDesc3")}</p>
        </div>
        <div className="col-span-2 p-10 bg-green/5">
          <h3>Bruger Oplevelser</h3>

          <ul className="space-y-4">
            <li>21+ Waoe Kanaler</li>
            <li>Netflix</li>
            <li>Youtube Premium</li>
            <li>Xbox Ultimate Med 4 kontroller</li>
            <li>100+ Kanaler fra Samsung</li>
            <li>Samsung App Store</li>
          </ul>

          <div className="relative h-52 w-full">
            <Image
              src={"/netflix.webp"}
              alt="netflix"
              fill
              priority
              className="object-contain"
            />
          </div>
          <Button className="flex-1 rounded-none w-full py-5 font-marcellus text-lg font-normal">
            Book Nu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lejeplads;
