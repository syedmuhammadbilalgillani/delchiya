"use client";
import { token } from "@/constants/urls";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { useTranslation } from "react-i18next";

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

const FilterSection = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [availablePeriods, setAvailablePeriods] = useState<AvailablePeriod[]>(
    []
  );
  const [fromDates, setFromDates] = useState<Date[]>([]);
  const { t } = useTranslation();
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<BookingData[]>(
          "https://api.villavilla.com/partner-api/v1/houses/122/availability?currency_code=208",
          {
            headers: {
              Authorization: token,
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
    const fromDate = selectedRange?.from;

    // If both dates are selected, show the range
    if (fromDate && selectedRange?.to) {
      return formatDateRange(fromDate, selectedRange.to);
    }

    // If only 'from' date is selected and we are in 'to' step, prompt for check-out date
    if (selectionStep === "to" && fromDate) {
      return `${formatDate(fromDate)} - ${t("select_check_out")}`;
    }

    // If 'from' date is selected but still in 'from' step, show just the 'from' date
    if (selectionStep === "from" && fromDate) {
      return formatDate(fromDate);
    }

    // Default state - show a loading message or prompt for check-in date
    return `${isLoading ? t("please_wait") : t("select_check_in_date")}`;
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
    <>
      <style jsx>{`
        .calender td:not(:has(button)) {
          background-color: transparent !important;
        }
      `}</style>
      <div className="bg-transparent -mt-12 px-[10%] relative z-10 calender">
        <div className="bg-green grid grid-cols-1 md:grid-cols-3 gap-5 p-5 w-full">
          <div className="relative w-full col-span-1 mobile-menu-container">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={isLoading}
              className="flex p-3 truncate items-center text-white gap-1 border border-yellow transition-colors  max-w-full w-full justify-between disabled:cursor-progress"
            >
              <span>{getButtonText()}</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 w-full sm:w-fit p-6 sm:p-4 bg-gray-50 border border-gray-200 shadow-lg z-10 left-0 sm:left-auto">
                <div className="mb-3 flex justify-between gap-2 items-center max-sm:flex-wrap">
                  <span className="text-sm font-medium">
                    {selectionStep === "from"
                      ? "Select Check-in Date"
                      : "Select Check-out Date"}
                  </span>
                  {selectionStep === "to" && (
                    <button
                      onClick={resetSelection}
                      className="text-xs text-yellow capitalize hover:underline"
                    >
                      reset dates
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
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
                        selectionStep === "to" &&
                        selectedRange?.from &&
                        hoveredDate
                          ? getHoverRangeDays(selectedRange.from, hoveredDate)
                          : [],
                      range_start: selectedRange?.from
                        ? [selectedRange.from]
                        : [],
                      range_end: selectedRange?.to ? [selectedRange.to] : [],
                      hover_end:
                        selectionStep === "to" && hoveredDate
                          ? [hoveredDate]
                          : [],
                    }}
                    modifiersClassNames={{
                      selected: "bg-green/90!",
                      selected_range: "bg-green/20! text-white!",
                      hover_range: "bg-green/60! text-white!",
                      range_start: "bg-green/90! text-white!",
                      range_end: "bg-green/90! text-white!",
                      hover_end: "",
                    }}
                    classNames={{
                      disabled: "text-green/50! bg-green/5!",
                      table: "w-full text-center",
                      today: "",
                      day: "border-5 border-white md:px-2.5 bg-green/50 text-white px-0.5 md:py-1 text-center ",
                      day_selected: "",
                      day_button: "cursor-pointer p-1 sm:p-2 transition-colors ",
                      nav: "absolute top-0 flex justify-between w-full",
                      month_caption: "mb-2 text-center",
                      button_next: "cursor-pointer",
                      button_previous: "cursor-pointer",
                      months:
                        "flex gap-2 sm:gap-6 relative custom-months-class",
                      caption: "text-sm sm:text-base",
                      caption_label: "text-sm sm:text-base",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex p-3 col-span-1 items-center text-white gap-2 border border-yellow transition-colors min-w-56 w-full justify-between">
            <label>{t("room_price")}</label>
            <div>{price?.rent || "-"}</div>
          </div>
          <Link
            href={
              !checkin && !checkout
                ? `/room/blommehuset`
                : `/room/blommehuset?checkin=${checkin}&checkout=${checkout}`
            }
          >
            <div className="text-center col-span-1 py-3 text-white gap-2 bg-yellow border-yellow hover:bg-yellow/80 transition-colors cursor-pointer w-full">
              {t("check_availability")}
            </div>
          </Link>
        </div>
      </div>{" "}
    </>
  );
};

export default FilterSection;
// "use client";
// import React, { useEffect, useState } from "react";
// import { Select } from "./ui/select";
// import { ChevronDown } from "lucide-react";
// import { DateRange, DayPicker } from "react-day-picker";
// import axios from "axios";
// // TypeScript interfaces (unchanged)
// interface Country {
//   name: string;
//   local_name: string;
//   code: string;
// }

// interface House {
//   id: number;
//   house_number: number;
//   place_name: string;
//   address: string;
//   postal_code: string;
//   city: string;
//   country: Country;
//   has_fixed_consumption: boolean;
//   cleaning_mandatory: boolean;
//   pinecone_badge: string | null;
// }

// interface Period {
//   from: string;
//   to: string;
//   days: number;
//   nights: number;
// }

// interface Pricing {
//   rent: number;
//   cleaning: number;
//   deposit: number;
//   discount: number | null;
//   fixed_consumption: number | null;
//   total: number;
//   total_excl_deposit: number;
//   currency: string;
//   currency_code: number;
// }

// interface BookingData {
//   house: House;
//   period: Period;
//   pricing: Pricing;
//   generated_at: string;
// }

// interface AvailablePeriod {
//   from: Date;
//   to: Date;
//   originalData: BookingData;
// }
// const FilterSection = () => {
//   const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
//   const [availablePeriods, setAvailablePeriods] = useState<AvailablePeriod[]>(
//     []
//   );
//   const [fromDates, setFromDates] = useState<Date[]>([]);
//   const [toDates, setToDates] = useState<Date[]>([]);
//   const [price, setPrice] = useState<Pricing | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Manage dropdown visibility
//   const [dropdownOpenTwo, setDropdownOpenTwo] = useState<boolean>(false); // Manage dropdown visibility

//   // Normalize date to midnight
//   const normalizeDate = (date: Date | undefined): Date => {
//     const normalized = new Date(date || "");
//     normalized.setHours(0, 0, 0, 0);
//     return normalized;
//   };

//   // Fetch availability data
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get<BookingData[]>(
//           "https://api.villavilla.com/partner-api/v1/houses/122/availability?currency_code=208",
//           {
//             headers: {
//               Authorization:
//                 "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
//             },
//           }
//         );
//         const apiData = response.data;
//         debugger;
//         const periods = apiData.map((item) => ({
//           from: normalizeDate(new Date(item.period.from)),
//           to: normalizeDate(new Date(item.period.to)),
//           originalData: item,
//         }));

//         setAvailablePeriods(periods);
//         setFromDates(periods.map((period) => period.from));
//         setToDates(periods.map((period) => period.to));
//       } catch (error) {
//         setError("Failed to load availability data. Please try again.");
//         console.error("Error fetching booking data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch pricing when both from and to dates are selected
//   //   useEffect(() => {
//   //     if (selectedRange?.from && selectedRange?.to) {
//   //       const fetchPrice = async () => {
//   //         setIsLoading(true);
//   //         setError(null);
//   //         setPrice(null);

//   //         const normalizedFrom = normalizeDate(selectedRange.from);
//   //         const normalizedTo = normalizeDate(selectedRange.to);
//   //         const matchingPeriod = availablePeriods.find(
//   //           (p) =>
//   //             p.from.getTime() === normalizedFrom.getTime() &&
//   //             p.to.getTime() === normalizedTo.getTime()
//   //         );

//   //         if (!matchingPeriod) {
//   //           setError("Invalid date range selected.");
//   //           setIsLoading(false);
//   //           return;
//   //         }

//   //         const formatLocalDate = (date: Date) =>
//   //           `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//   //             2,
//   //             "0"
//   //           )}-${String(date.getDate()).padStart(2, "0")}`;

//   //         const bookingRequest = {
//   //           from_date: formatLocalDate(normalizedFrom),
//   //           to_date: formatLocalDate(normalizedTo),
//   //           house_id: matchingPeriod.originalData.house.id,
//   //           nights: matchingPeriod.originalData.period.nights,
//   //           timestamp: new Date().toISOString(),
//   //         };

//   //         try {
//   //           const response = await axios.get(
//   //             `https://api.villavilla.com/partner-api/v1/period?house_id=${bookingRequest.house_id}&arrival=${bookingRequest.from_date}&departure=${bookingRequest.to_date}&currency_code=208`,
//   //             {
//   //               headers: {
//   //                 Authorization:
//   //                   "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
//   //               },
//   //             }
//   //           );
//   //           setPrice(response.data.pricing);
//   //         } catch (error) {
//   //           setError("Failed to fetch pricing data. Please try again.");
//   //           console.error("Error fetching price:", error);
//   //         } finally {
//   //           setIsLoading(false);
//   //         }
//   //       };

//   //       fetchPrice();
//   //     }
//   //   }, [selectedRange, availablePeriods]);

//   // Handle date range selection
//   const handleRangeSelect = (range: DateRange | undefined) => {
//     if (!range) {
//       setSelectedRange(undefined);
//       setPrice(null);
//       return;
//     }

//     const normalizedFrom = range.from ? normalizeDate(range.from) : undefined;
//     const normalizedTo = range.to ? normalizeDate(range.to) : undefined;

//     // Handle single date selection (from date)
//     if (
//       normalizedFrom &&
//       (!normalizedTo || normalizedFrom.getTime() === normalizedTo.getTime())
//     ) {
//       if (!fromDates.some((d) => d.getTime() === normalizedFrom.getTime())) {
//         alert("Please select a valid check-in date (marked in teal).");
//         return;
//       }
//       setSelectedRange({ from: normalizedFrom, to: undefined });
//       setPrice(null);
//       return;
//     }

//     // Handle range selection
//     if (normalizedFrom && normalizedTo) {
//       const matchingPeriod = availablePeriods.find(
//         (period) =>
//           period.from.getTime() === normalizedFrom.getTime() &&
//           period.to.getTime() === normalizedTo.getTime()
//       );
//       if (!matchingPeriod) {
//         alert("Please select a valid check-out date (marked in coral).");
//         return;
//       }
//       setSelectedRange({ from: normalizedFrom, to: normalizedTo });
//     }
//   };

//   // Format date for display
//   const formatDate = (date: Date) =>
//     date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });

//   // new handlers
//   const handleSelectFrom = (date: Date | undefined) => {
//     if (!date) return;
//     const d = normalizeDate(date);
//     if (!fromDates.some((fd) => fd.getTime() === d.getTime())) return;
//     setSelectedRange({ from: d, to: undefined });
//     setPrice(null);
//     setError(null);
//   };

//   const handleSelectTo = (date: Date | undefined) => {
//     debugger;
//     console.log(date, "date");
//     if (!date || !selectedRange?.from) return;
//     debugger;
//     const d = normalizeDate(date);
//     const match = availablePeriods.find(
//       (p) =>
//         p.from.getTime() === selectedRange.from!.getTime() &&
//         p.to.getTime() === d.getTime()
//     );
//     console.log(match, "match");
//     debugger;
//     if (!match) return;
//     debugger;
//     setSelectedRange({ from: selectedRange.from, to: d });

//     setPrice(match.originalData.pricing);
//   };
//   return (
//     <div className="bg-transparent -mt-20  px-[10%] relative z-10">
//       <div className="bg-green flex justify-start gap-5 p-5">
//         <div className="relative">
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             disabled={isLoading}
//             className="flex p-3 items-center text-white gap-2 border border-yellow   transition-colors min-w-60 max-w-fit justify-between disabled:cursor-progress"
//           >
//             <span>
//               {selectedRange?.from
//                 ? formatDate(selectedRange.from)
//                 : "Select Date"}
//             </span>
//             <ChevronDown size={16} />
//           </button>

//           {dropdownOpen && (
//             <div className="absolute mt-2 w-80 p-4 bg-gray-50 border border-gray-200  shadow-lg z-10">
//               <DayPicker
//                 mode="single"
//                 selected={selectedRange?.from}
//                 onSelect={handleSelectFrom}
//                 disabled={[
//                   { before: new Date() },
//                   (date) =>
//                     !fromDates.some(
//                       (fd) => fd.getTime() === normalizeDate(date).getTime()
//                     ),
//                 ]}
//                 modifiersClassNames={{
//                   selected: "bg-yellow text-white rounded-md cursor-pointer",
//                 }}
//                 classNames={{
//                   disabled: "line-through text-gray-400 cursor-not-allowed",
//                   table: "w-full text-center",
//                   day: " text-center",
//                   day_selected: "bg-yellow text-white hover:bg-teal-700",
//                   day_button: " cursor-pointer p-2.5  rounded-md",
//                   nav: "flex justify-between mb-2",
//                   month_caption: "mb-2 text-center",
//                   button_next: "cursor-pointer",
//                   button_previous: "cursor-pointer",
//                 }}
//               />
//             </div>
//           )}
//         </div>
//         <div className="relative ">
//           <button
//             onClick={() => setDropdownOpenTwo(!dropdownOpenTwo)}
//             disabled={isLoading}
//             className="flex p-3 items-center text-white gap-2 border border-yellow   transition-colors min-w-60 max-w-fit justify-between disabled:cursor-progress"
//           >
//             <span>
//               {selectedRange?.to ? formatDate(selectedRange.to) : "Select Date"}
//             </span>
//             <ChevronDown size={16} />
//           </button>
//           {dropdownOpenTwo && selectedRange?.from && (
//             <div className="absolute mt-2 w-80 p-4 bg-gray-50 border border-gray-200  shadow-lg z-10">
//               <DayPicker
//                 mode="single"
//                 selected={selectedRange?.to}
//                 onSelect={handleSelectTo}
//                 disabled={[
//                   !selectedRange?.from
//                     ? () => true
//                     : (date) => {
//                         const nd = normalizeDate(date);
//                         return !availablePeriods.some(
//                           (p) =>
//                             p.from.getTime() ===
//                               selectedRange.from!.getTime() &&
//                             p.to.getTime() === nd.getTime()
//                         );
//                       },
//                 ]}
//                 modifiersClassNames={{
//                   selected: "bg-yellow text-white rounded-md cursor-pointer",
//                 }}
//                 classNames={{
//                   disabled: "line-through text-gray-400 cursor-not-allowed",
//                   table: "w-full text-center",
//                   day: " text-center",
//                   day_selected: "bg-yellow text-white hover:bg-teal-700",
//                   day_button:
//                     " cursor-pointer p-2.5  rounded-md transition-colors",
//                   nav: "flex justify-between mb-2",
//                   month_caption: "mb-2 text-center",
//                   button_next: "cursor-pointer",
//                   button_previous: "cursor-pointer",
//                 }}
//               />
//             </div>
//           )}
//         </div>
//         <div className="flex p-3 items-center text-white gap-2 border border-yellow   transition-colors min-w-56 max-w-56 justify-between">
//           <label>Price</label>
//           <div>{price?.rent}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilterSection;
