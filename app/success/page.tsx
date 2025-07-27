"use client";

import { notFound, useSearchParams } from "next/navigation";
import React from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-green-50 px-4">
      <div className="max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-green-600">
          🎉 Booking Successful!
        </h1>
        <p className="text-gray-700 mt-4">
          Your payment was successful and your booking is confirmed.
        </p>
       
      </div>
    </div>
  );
};

export default SuccessPage;
