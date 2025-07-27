import React, { Suspense } from "react";
import RoomPage from "./Room";

const page = () => {
  return (
    <Suspense>
      <RoomPage />
    </Suspense>
  );
};

export default page;
