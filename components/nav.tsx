"use client"
import Link from "next/link";
import React from "react";
import Logout from "./logout";
import { usePathname } from "next/navigation";

const NavbarForAdmin = () => {
  const pathname = usePathname();
  return (
    <div
      className={` ${pathname.startsWith("/d/a") ? "" : "hidden"} border-b `}
    >
      <div className=" px-3 flex items-center justify-between bg-white max-w-7xl mx-auto">
        <ul className="list-none flex items-center justify-center gap-x-8 text-black font-semibold uppercase tracking-wide ">
          <li className="hover:text-yellow transition-all duration-300 ease-in-out transform s">
            <Link href="/d/a/blog">Blog</Link>
          </li>
          <li className="hover:text-yellow transition-all duration-300 ease-in-out transform s">
            <Link href="/d/a/booking">Booking</Link>
          </li>
          <li className="hover:text-yellow transition-all duration-300 ease-in-out transform s">
            <Link href="/d/a/coupon">Coupon</Link>
          </li>
          <li className="hover:text-yellow transition-all duration-300 ease-in-out transform s">
            <Link href="/d/a/translation">Translation</Link>
          </li>
        </ul>
        <Logout />
      </div>
    </div>
  );
};

export default NavbarForAdmin;
