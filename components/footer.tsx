import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-black">
      <div className="main  flex justify-between max-sm:flex-wrap gap-10 items-center">
        <p className=" text-white">
          © Copyright CozyStay WordPress Theme for Hotel Booking.
        </p>
        <div>
          <ul className="flex gap-5 items-center uppercase text-white list-none">
            <li>
              <Link className="hover:text-yellow text-sm" href={"/"}>privacy</Link>
            </li>
            <li>
              <Link className="hover:text-yellow text-sm" href={"/"}>term of use</Link>
            </li>
            <li>
              <Link className="hover:text-yellow text-sm" href={"/"}>policy</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
