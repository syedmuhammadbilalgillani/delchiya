"use client";
import { useEffect, useState } from "react";

export default function HotelDyamic() {
  const [values, setValues] = useState({
    hems: 0,
    badevaerelser: 0,
    vaerelser: 0,
    six: 0,
  });

  // Function to animate the number increment
  const animateNumbers = (targetValues) => {
    const interval = setInterval(() => {
      setValues((prevValues) => {
        let updated = { ...prevValues };
        let stopAnimation = true;

        // Increment each value dynamically
        for (let key in targetValues) {
          if (updated[key] < targetValues[key]) {
            updated[key]++;
            stopAnimation = false;
          }
        }

        if (stopAnimation) clearInterval(interval);
        return updated;
      });
    }, 50); // Increment every 50ms
  };

  useEffect(() => {
    // Trigger the animation on page load
    animateNumbers({ hems: 18, badevaerelser: 2, vaerelser: 3, six: 6 });
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center md:gap-20  gap-10 text-white">
        <div>
          <h3 className="text-7xl"> {values.hems}</h3>
          <div>Hems</div>
        </div>
        <div>
          <h3 className="text-7xl">{values.badevaerelser}</h3>
          <div>Badeværelser</div>
        </div>
        <div>
          <h3 className="text-7xl">{values.vaerelser}</h3>
          <div>Værelser</div>
        </div>
        <div>
          <h3 className="text-7xl">{values.six}</h3>
          <div>Six</div>
        </div>
      </div>
    </div>
  );
}
