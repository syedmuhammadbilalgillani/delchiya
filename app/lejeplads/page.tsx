import Text from "@/components/Language/TranslatedText";
import React from "react";

const Lejeplads = () => {
  return (
    <div
      className="relative w-full max-h-[556px] max-sm:h-[75dvh]"
      style={{
        transform: "translate3d(0px, 0px, 0px)",
        WebkitTransform: "translate3d(0px, 0px, 0px)",
        height: "556px",
        marginTop: "-70px"
      }}
    >
      {" "}
      <iframe
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Crystal UHD - AU8000: Official Introduction | Samsung"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/GRFKeCRoZco?controls=0&amp;rel=0&amp;playsinline=1&amp;cc_load_policy=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fwww.delchiya.de&amp;widgetid=1&amp;forigin=https%3A%2F%2Fwww.delchiya.de%2Factivity-detail-2%2F&amp;aoriginsup=1&amp;vf=5"
        id="widget2"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        allowFullScreen
      ></iframe>
      {/* Overlay */}
      {/* Content */}
      <div className="relative z-10 pt-24 md:pt-0 flex flex-col gap-6 items-center justify-center text-center h-full px-5">
        <Text
          as="h1"
          className="text-white text-5xl md:text-8xl max-w-[10ch] font-marcellus font-normal"
          textKey="headline"
        />

        <Text as="p" className="text-xl text-white" textKey="subheadline" />
      </div>
    </div>
  );
};

export default Lejeplads;
