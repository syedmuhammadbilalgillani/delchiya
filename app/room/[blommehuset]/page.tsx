import React, { Suspense } from "react";
import RoomPage from "./Room";
import { notFound } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ blommehuset: string }>;
}) => {
  const { blommehuset } = await params;
  if (blommehuset !== "blommehuset") return notFound();
  return (
    <Suspense>
      <RoomPage />
    </Suspense>
  );
};

export default page;
