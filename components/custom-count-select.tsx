"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

interface CounterSelectProps {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
  dropdownKey: string;
  openDropdown: string | null;
  setOpenDropdown: (key: string | null) => void;
  totalOccupants?: number; // Make optional since linen doesn't need it
  maxOccupants?: number; // Make optional
  isOccupantCounter?: boolean; // New prop to identify if this is for people count
  className?: string;
}

const CounterSelect: React.FC<CounterSelectProps> = ({
  label,
  value,
  setValue,
  min = 0,
  max = 18,
  dropdownKey,
  openDropdown,
  setOpenDropdown,
  totalOccupants = 0,
  maxOccupants = 18,
  isOccupantCounter = false, // Default to false
  className,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOpen = openDropdown === dropdownKey;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, [isOpen, setOpenDropdown]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(isOpen ? null : dropdownKey);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(Math.max(value - 1, min));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only apply occupant limit if this is an occupant counter
    if (!isOccupantCounter || totalOccupants < maxOccupants) {
      setValue(Math.min(value + 1, max));
    }
  };

  // Calculate remaining slots only for occupant counters
  const remainingSlots = isOccupantCounter
    ? maxOccupants - totalOccupants
    : Infinity;
  const canIncrement =
    (!isOccupantCounter || remainingSlots > 0) && value < max;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        
        className="flex justify-between items-center border border-[#c7b299] px-2 py-2 cursor-pointer select-none"
      >
        <span>{label}</span>
        <div className="flex items-center gap-1">
          <span>{value}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-full border bg-[#F9F5F0] p-2 z-10 shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <button
              onClick={handleDecrement}
              className="px-4 py-1"
              disabled={value <= min}
            >
              −
            </button>
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium px-4">{value}</span>
              {/* {isOccupantCounter && remainingSlots < 3 && (
                <span className="text-xs text-gray-500 mt-1">
                  {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""}{" "}
                  remaining
                </span>
              )} */}
            </div>
            <button
              onClick={handleIncrement}
              disabled={!canIncrement}
              className="px-4 py-1"

            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterSelect;
