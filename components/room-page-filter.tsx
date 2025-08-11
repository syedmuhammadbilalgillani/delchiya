"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CounterSelect from "./custom-count-select";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRoomStore } from "@/store/useRoom";
import CalenderDialog from "./calender-dialog";
import { useTranslation } from "react-i18next";
interface Pricing {
  rent: number;
  cleaning: number;
  deposit: number;
  discount: number | null;
  fixed_consumption: number | null;
  total: number;
  total_excl_deposit: number;
  currency: string;
  currency_code: number;
}

interface RoomPageFilterProps {
  price: Pricing;
}
const MAX_OCCUPANTS = 18;

const RoomPageFilter = ({ price }: RoomPageFilterProps) => {
  const { t } = useTranslation();
  const rengoringFees = true;
  const searchParams = useSearchParams();
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Get values from Zustand store
  const {
    adults,
    children,
    linnedCount,
    linnedChecked,
    basePrice,
    rengoring,
    totalPrice,
    checkin: storeCheckin,
    checkout: storeCheckout,
    setAdults,
    setChildren,
    setLinnedCount,
    setLinnedChecked,
    setBasePrice,
    setRengoring,
    setCheckin,
    setCheckout,
    setTotalPrice,
    setDiscount,
  } = useRoomStore();

  const totalOccupants = adults + children;

  // Set checkin and checkout from query params if not already set
  useEffect(() => {
    if (!storeCheckin && checkin) setCheckin(checkin);
    if (!storeCheckout && checkout) setCheckout(checkout);
  }, [checkin, checkout, setCheckin, setCheckout, storeCheckin, storeCheckout]);

  // Calculate total price whenever relevant state changes
  useEffect(() => {
    const base = price?.rent ?? 0;
    const rengoringVal = rengoringFees ? price?.cleaning : 0;
    const discountAmount = Math.abs(price?.discount ?? 0);
    const linnedVal = linnedChecked ? linnedCount * 135 : 0;

    setBasePrice(base);
    setDiscount(discountAmount);
    setRengoring(rengoringVal);
    setTotalPrice(base + rengoringVal + linnedVal - discountAmount);
  }, [
    price?.rent,
    price?.cleaning,
    price?.discount,
    rengoringFees,
    linnedChecked,
    linnedCount,
    setBasePrice,
    setRengoring,
    setTotalPrice,
  ]);
  // Pure function for displaying the total price
  const calculateTotalPrice = () => {
    const base = price?.rent ?? 0;
    const rengoringVal = rengoringFees ? price?.cleaning : 0;
    const linnedVal = linnedChecked ? linnedCount * 135 : 0;
    const discountAmount = Math.abs(price?.discount ?? 0);
    const total = base + rengoringVal + linnedVal - discountAmount;
    const safeTotal = isNaN(total) ? 0 : total;

    return safeTotal;
  };

  return (
    <div className="shadow-[0px_0px_4px_1px_rgba(0,_0,_0,_0.1)] p-5 rounded-lg sticky top-10">
      <h2>{t("reserve")}:</h2>
      <div className=" mt-5">
        <CalenderDialog />
      </div>
      <div className="flex gap-2 w-full my-5">
        <CounterSelect
          label={t('adults')}
          value={adults}
          setValue={setAdults}
          min={1}
          dropdownKey="adults"
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          totalOccupants={adults + children}
          maxOccupants={18}
          isOccupantCounter={true}
          className="w-full"
        />
        <CounterSelect
          label={t('children')}
          value={children}
          setValue={setChildren}
          dropdownKey="children"
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          totalOccupants={adults + children}
          maxOccupants={18}
          isOccupantCounter={true}
          className="w-full"
        />
      </div>

      <h3>{t("extra_services")}</h3>
      <div className="space-y-2 mt-5">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <label className="custom-checkbox-wrapper">
              <input
                id="rengoringFees"
                checked={rengoringFees}
                disabled
                type="checkbox"
                className="custom-checkbox disabled:cursor-not-allowed"
              />
              <span className="checkmark"></span>
            </label>
            <label>{t("cleaning_fees")}</label>
          </div>

          <span>{rengoringFees ? price?.cleaning : "0"} kr.</span>
        </div>
        <div className="flex flex-wrap justify-between gap-5 items-center">
          <div className="flex gap-2">
            <label className="custom-checkbox-wrapper col-span-1">
              <input
                id="linned-checkbox"
                checked={linnedChecked}
                onChange={() => setLinnedChecked(!linnedChecked)}
                type="checkbox"
                className="custom-checkbox disabled:cursor-not-allowed"
              />
              <span className="checkmark"></span>
            </label>
            <div className="flex gap-1 items-center text-nowrap ">
              <label>{t("linned_per_set")}</label>
              <span className="text-sm">135 kr. / Person </span>
            </div>
          </div>
          <div>
            <CounterSelect
              label={t("linned_sets")}
              value={linnedCount}
              setValue={setLinnedCount}
              min={0}
              dropdownKey="linned"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              className="w-36"
            />
          </div>
        </div>
        <hr className="my-5" />
        <Collapsible>
          <div className="flex justify-between">
            <CollapsibleTrigger className="flex items-center gap-2">
              <span className="text-2xl font-marcellus">{t("total_cost")}</span>
              <ChevronDown size={18} />
            </CollapsibleTrigger>
            <div>{calculateTotalPrice()} kr.</div>
          </div>
          <CollapsibleContent>
            <div className="flex justify-between border-t border-dashed py-3 mt-3">
              <label>{t("total_base_price")}</label>
              <div>{price?.rent ?? 0} kr.</div>
            </div>
            {price?.discount && (
              <div className="flex justify-between border-t border-dashed py-3 mt-3">
                <label>{t("discount")}</label>
                <div>{Math.abs(price?.discount ?? 0)} kr.</div>
              </div>
            )}
            <div className="flex justify-between border-t border-dashed py-3">
              <label>{t("extra_services_price")}</label>
              <div>{`${linnedChecked ? linnedCount * 135 : "0"} kr.`}</div>
            </div>
            <div className="flex justify-between border-t border-dashed py-3">
              <label>{t("cleaning")}</label>
              <div>{rengoringFees ? price?.cleaning : "0"}</div>
            </div>
            <div className="flex justify-between border-y border-dashed py-3">
              <label>{t("total_price")}</label>
              <div>{calculateTotalPrice()} kr.</div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <Link href={"/checkout"}>
        <Button
          variant={"default"}
          className="rounded w-full py-6 my-5 text-lg font-marcellus"
          disabled={!price?.rent}
          onClick={() => {
            setBasePrice(price?.rent ?? 0);
            setRengoring(price?.cleaning ?? 0);
            setTotalPrice(calculateTotalPrice());
          }}
        >
          {t("book_your_stay_now")}
        </Button>
      </Link>
    </div>
  );
};

export default RoomPageFilter;
