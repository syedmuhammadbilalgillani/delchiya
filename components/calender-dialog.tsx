"use client";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Country {
  name: string;
  local_name: string;
  code: string;
}

interface House {
  id: number;
  house_number: number;
  place_name: string;
  address: string;
  postal_code: string;
  city: string;
  country: Country;
  has_fixed_consumption: boolean;
  cleaning_mandatory: boolean;
  pinecone_badge: string | null;
}

interface Period {
  from: string;
  to: string;
  days: number;
  nights: number;
}

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

interface BookingData {
  house: House;
  period: Period;
  pricing: Pricing;
  generated_at: string;
}

interface AvailablePeriod {
  from: Date;
  to: Date;
  originalData: BookingData;
}

const CalenderDialog = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [availablePeriods, setAvailablePeriods] = useState<AvailablePeriod[]>(
    []
  );
  const [fromDates, setFromDates] = useState<Date[]>([]);
  const [toDates, setToDates] = useState<Date[]>([]);
  const [price, setPrice] = useState<Pricing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectionStep, setSelectionStep] = useState<"from" | "to">("from"); // Track selection step
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null); // Track hovered date

  // Normalize date to midnight
  const normalizeDate = (date: Date | undefined): Date => {
    const normalized = new Date(date || "");
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };
  const [IsOpen, setIsOpen] = useState(false);

  // Fetch availability data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<BookingData[]>(
          "https://api.villavilla.com/partner-api/v1/houses/122/availability?currency_code=208",
          {
            headers: {
              Authorization:
                "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
            },
          }
        );
        const apiData = response.data;
        const periods = apiData.map((item) => ({
          from: normalizeDate(new Date(item.period.from)),
          to: normalizeDate(new Date(item.period.to)),
          originalData: item,
        }));

        setAvailablePeriods(periods);
        setFromDates(periods.map((period) => period.from));
        setToDates(periods.map((period) => period.to));
      } catch (error) {
        setError("Failed to load availability data. Please try again.");
        console.error("Error fetching booking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all days between from and to dates (inclusive of start/end)
  const getRangeDays = (fromDate: Date, toDate: Date): Date[] => {
    const days: Date[] = [];
    const currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  // Get range days for hover preview
  const getHoverRangeDays = (fromDate: Date, hoveredDate: Date): Date[] => {
    if (hoveredDate < fromDate) return [];
    return getRangeDays(fromDate, hoveredDate);
  };

  // Get available "to" dates for selected "from" date
  const getAvailableToDatesForFrom = (fromDate: Date): Date[] => {
    return availablePeriods
      .filter((period) => period.from.getTime() === fromDate.getTime())
      .map((period) => period.to);
  };

  // Handle date selection based on current step
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const normalizedDate = normalizeDate(date);

    if (selectionStep === "from") {
      // First step: Select "from" date
      if (!fromDates.some((fd) => fd.getTime() === normalizedDate.getTime())) {
        return; // Invalid from date
      }

      setSelectedRange({ from: normalizedDate, to: undefined });
      setPrice(null);
      setSelectionStep("to"); // Move to "to" date selection
    } else if (selectionStep === "to") {
      // Second step: Select "to" date
      if (!selectedRange?.from) return;

      const availableToDates = getAvailableToDatesForFrom(selectedRange.from);
      if (
        !availableToDates.some(
          (td) => td.getTime() === normalizedDate.getTime()
        )
      ) {
        return; // Invalid to date for selected from date
      }

      const matchingPeriod = availablePeriods.find(
        (period) =>
          period.from.getTime() === selectedRange.from!.getTime() &&
          period.to.getTime() === normalizedDate.getTime()
      );

      if (matchingPeriod) {
        setSelectedRange({ from: selectedRange.from, to: normalizedDate });
        setPrice(matchingPeriod.originalData.pricing);
        // setDropdownOpen(false); // Close dropdown after selection
      }
    }
  };

  // Reset selection to start over
  const resetSelection = () => {
    setSelectedRange(undefined);
    setPrice(null);
    setSelectionStep("from");
    setHoveredDate(null);
  };

  // Handle mouse enter for hover effects
  const handleMouseEnter = (date: Date) => {
    if (selectionStep === "to" && selectedRange?.from) {
      const normalizedDate = normalizeDate(date);
      const availableToDates = getAvailableToDatesForFrom(selectedRange.from);

      // Only set hover if it's a valid to date
      if (
        availableToDates.some((td) => td.getTime() === normalizedDate.getTime())
      ) {
        setHoveredDate(normalizedDate);
      }
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  // Get disabled dates based on current selection step
  const getDisabledDates = () => {
    if (selectionStep === "from") {
      // In "from" step: disable all dates except valid from dates
      return (date: Date) => {
        const normalizedDate = normalizeDate(date);
        return (
          normalizedDate < normalizeDate(new Date()) || // Past dates
          !fromDates.some((fd) => fd.getTime() === normalizedDate.getTime()) // Not a valid from date
        );
      };
    } else if (selectionStep === "to" && selectedRange?.from) {
      // In "to" step: disable all dates except valid to dates for selected from date
      const availableToDates = getAvailableToDatesForFrom(selectedRange.from);
      return (date: Date) => {
        const normalizedDate = normalizeDate(date);
        return !availableToDates.some(
          (td) => td.getTime() === normalizedDate.getTime()
        );
      };
    }

    return () => true; // Disable all if no valid state
  };

  // Format date for display with day and year
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Format date range for button display
  const formatDateRange = (fromDate: Date, toDate: Date) => {
    const fromFormatted = fromDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const toFormatted = toDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${fromFormatted} - ${toFormatted}`;
  };

  // Get current selected date for display
  const getCurrentSelectedDate = () => {
    if (selectionStep === "from") {
      return selectedRange?.from;
    } else {
      return selectedRange?.to;
    }
  };

  // Get button text based on selection step
  const getButtonText = () => {
    // If both dates are selected, show the range
    if (selectedRange?.from && selectedRange?.to) {
      return formatDateRange(selectedRange.from, selectedRange.to);
    }

    // If only from date is selected (in 'to' step)
    if (selectionStep === "to" && selectedRange?.from) {
      return `${formatDate(selectedRange.from)} - Select Check-out`;
    }

    // If from date is selected but we're still in 'from' step
    if (selectionStep === "from" && selectedRange?.from) {
      return formatDate(selectedRange.from);
    }

    // Default state
    return `${isLoading ? "Please wait..." : "Select Check-in Date"}`;
  };
  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".mobile-menu-container")) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);
  const formatDateT = (date: Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const checkin = formatDateT(selectedRange?.from);
  const checkout = formatDateT(selectedRange?.to);
  return (
    <Dialog open={IsOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex p-2   items-center text-green gap-2 border border-yellow transition-colors min-w-  w-full">
        {price?.rent ? price.rent : "Check Ind - Check ud"}
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <div className="overflow-x-auto max-w-full mx-auto  p-5">
          <div className="mb-3 flex justify-between gap-2 items-center max-sm:flex-wrap">
            <span className="text-sm font-medium">
              {selectionStep === "from"
                ? "Select Check-in Date"
                : "Select Check-out Date"}
            </span>
            {selectionStep === "to" && (
              <button
                onClick={resetSelection}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Change Check-in
              </button>
            )}
          </div>
          <DayPicker
            mode="single"
            selected={getCurrentSelectedDate()}
            onSelect={handleDateSelect}
            numberOfMonths={window.innerWidth < 640 ? 1 : 2}
            disabled={getDisabledDates()}
            onDayMouseEnter={handleMouseEnter}
            onDayMouseLeave={handleMouseLeave}
            modifiers={{
              selected_range:
                selectedRange?.from && selectedRange?.to
                  ? getRangeDays(selectedRange.from, selectedRange.to)
                  : [],
              hover_range:
                selectionStep === "to" && selectedRange?.from && hoveredDate
                  ? getHoverRangeDays(selectedRange.from, hoveredDate)
                  : [],
              range_start: selectedRange?.from ? [selectedRange.from] : [],
              range_end: selectedRange?.to ? [selectedRange.to] : [],
              hover_end:
                selectionStep === "to" && hoveredDate ? [hoveredDate] : [],
            }}
            modifiersClassNames={{
              selected: "bg-green text-white cursor-pointer",
              selected_range: "bg-green/80 border-2 border-white text-white",
              hover_range: "bg-green text-white border-2 border-white",
              range_start: "bg-green text-white font-semibold",
              range_end: "bg-green text-white font-semibold",
              hover_end: "bg-green text-white font-semibold",
            }}
            classNames={{
              disabled: "line-through text-gray-400 cursor-not-allowed",
              table: "w-full text-center",
              day: "text-center  border-2 border-gray-300 w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base",
              day_selected: "bg-yellow text-white hover:bg-teal-700",
              day_button: "cursor-pointer p-1 sm:p-2 transition-colors",
              nav: "absolute top-0 flex justify-between w-full",
              month_caption: "mb-2 text-center",
              button_next: "cursor-pointer",
              button_previous: "cursor-pointer",
              months: "flex gap-2 sm:gap-6 relative",
              caption: "text-sm sm:text-base",
              caption_label: "text-sm sm:text-base",
            }}
          />
        </div>
        <div className="flex p-3   col-span-1 items-center text-green gap-2 border border-yellow transition-colors min-w-56  w-full justify-between">
          <label>Price</label>
          <div>{price?.rent || "-"}</div>
        </div>
        <Link
          href={`/room/blommehuset?checkin=${checkin}&checkout=${checkout}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="text-center col-span-1   py-3  text-white gap-2  bg-yellow border-yellow hover:bg-yellow/80 transition-colors cursor-pointer w-full ">
            Check Availibilty
          </div>
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default CalenderDialog;
