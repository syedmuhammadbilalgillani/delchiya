"use client"
import dynamic from "next/dynamic";
import React from "react";
const LocationCard = dynamic(() => import("@/components/map-sec"), {
  ssr: false,
});

const Location = () => {
  return <LocationCard />;
};

export default Location;
