"use client";
import React, { useEffect, useState } from "react";
import { Select } from "./ui/select";
import { ChevronDown } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import axios from "axios";
// TypeScript interfaces (unchanged)
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
  const [toDates, setToDates] = useState<Date[]>([]);
  const [price, setPrice] = useState<Pricing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Manage dropdown visibility
  const [dropdownOpenTwo, setDropdownOpenTwo] = useState<boolean>(false); // Manage dropdown visibility

  // Normalize date to midnight
  const normalizeDate = (date: Date | undefined): Date => {
    const normalized = new Date(date || "");
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

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
        debugger;
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

  // Fetch pricing when both from and to dates are selected
  //   useEffect(() => {
  //     if (selectedRange?.from && selectedRange?.to) {
  //       const fetchPrice = async () => {
  //         setIsLoading(true);
  //         setError(null);
  //         setPrice(null);

  //         const normalizedFrom = normalizeDate(selectedRange.from);
  //         const normalizedTo = normalizeDate(selectedRange.to);
  //         const matchingPeriod = availablePeriods.find(
  //           (p) =>
  //             p.from.getTime() === normalizedFrom.getTime() &&
  //             p.to.getTime() === normalizedTo.getTime()
  //         );

  //         if (!matchingPeriod) {
  //           setError("Invalid date range selected.");
  //           setIsLoading(false);
  //           return;
  //         }

  //         const formatLocalDate = (date: Date) =>
  //           `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  //             2,
  //             "0"
  //           )}-${String(date.getDate()).padStart(2, "0")}`;

  //         const bookingRequest = {
  //           from_date: formatLocalDate(normalizedFrom),
  //           to_date: formatLocalDate(normalizedTo),
  //           house_id: matchingPeriod.originalData.house.id,
  //           nights: matchingPeriod.originalData.period.nights,
  //           timestamp: new Date().toISOString(),
  //         };

  //         try {
  //           const response = await axios.get(
  //             `https://api.villavilla.com/partner-api/v1/period?house_id=${bookingRequest.house_id}&arrival=${bookingRequest.from_date}&departure=${bookingRequest.to_date}&currency_code=208`,
  //             {
  //               headers: {
  //                 Authorization:
  //                   "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
  //               },
  //             }
  //           );
  //           setPrice(response.data.pricing);
  //         } catch (error) {
  //           setError("Failed to fetch pricing data. Please try again.");
  //           console.error("Error fetching price:", error);
  //         } finally {
  //           setIsLoading(false);
  //         }
  //       };

  //       fetchPrice();
  //     }
  //   }, [selectedRange, availablePeriods]);

  // Handle date range selection
  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setSelectedRange(undefined);
      setPrice(null);
      return;
    }

    const normalizedFrom = range.from ? normalizeDate(range.from) : undefined;
    const normalizedTo = range.to ? normalizeDate(range.to) : undefined;

    // Handle single date selection (from date)
    if (
      normalizedFrom &&
      (!normalizedTo || normalizedFrom.getTime() === normalizedTo.getTime())
    ) {
      if (!fromDates.some((d) => d.getTime() === normalizedFrom.getTime())) {
        alert("Please select a valid check-in date (marked in teal).");
        return;
      }
      setSelectedRange({ from: normalizedFrom, to: undefined });
      setPrice(null);
      return;
    }

    // Handle range selection
    if (normalizedFrom && normalizedTo) {
      const matchingPeriod = availablePeriods.find(
        (period) =>
          period.from.getTime() === normalizedFrom.getTime() &&
          period.to.getTime() === normalizedTo.getTime()
      );
      if (!matchingPeriod) {
        alert("Please select a valid check-out date (marked in coral).");
        return;
      }
      setSelectedRange({ from: normalizedFrom, to: normalizedTo });
    }
  };

  // Format date for display
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // new handlers
  const handleSelectFrom = (date: Date | undefined) => {
    if (!date) return;
    const d = normalizeDate(date);
    if (!fromDates.some((fd) => fd.getTime() === d.getTime())) return;
    setSelectedRange({ from: d, to: undefined });
    setPrice(null);
    setError(null);
  };

  const handleSelectTo = (date: Date | undefined) => {
    debugger;
    console.log(date, "date");
    if (!date || !selectedRange?.from) return;
    debugger;
    const d = normalizeDate(date);
    const match = availablePeriods.find(
      (p) =>
        p.from.getTime() === selectedRange.from!.getTime() &&
        p.to.getTime() === d.getTime()
    );
    console.log(match, "match");
    debugger;
    if (!match) return;
    debugger;
    setSelectedRange({ from: selectedRange.from, to: d });

    setPrice(match.originalData.pricing);
  };
  return (
    <div className="bg-transparent -mt-20  px-[10%] relative z-10">
      <div className="bg-green flex justify-start gap-5 p-5">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={isLoading}
            className="flex p-3 items-center text-white gap-2 border border-yellow   transition-colors min-w-60 max-w-fit justify-between disabled:cursor-progress"
          >
            <span>
              {selectedRange?.from
                ? formatDate(selectedRange.from)
                : "Select Date"}
            </span>
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="absolute mt-2 w-80 p-4 bg-gray-50 border border-gray-200  shadow-lg z-10">
              <DayPicker
                mode="single"
                selected={selectedRange?.from}
                onSelect={handleSelectFrom}
                disabled={[
                  { before: new Date() },
                  (date) =>
                    !fromDates.some(
                      (fd) => fd.getTime() === normalizeDate(date).getTime()
                    ),
                ]}
                modifiersClassNames={{
                  selected: "bg-yellow text-white rounded-md cursor-pointer",
                }}
                classNames={{
                  disabled: "line-through text-gray-400 cursor-not-allowed",
                  table: "w-full text-center",
                  day: " text-center",
                  day_selected: "bg-yellow text-white hover:bg-teal-700",
                  day_button: " cursor-pointer p-2.5  rounded-md",
                  nav: "flex justify-between mb-2",
                  month_caption: "mb-2 text-center",
                  button_next: "cursor-pointer",
                  button_previous: "cursor-pointer",
                }}
              />
            </div>
          )}
        </div>
        <div className="relative ">
          <button
            onClick={() => setDropdownOpenTwo(!dropdownOpenTwo)}
            disabled={isLoading}
            className="flex p-3 items-center text-white gap-2 border border-yellow   transition-colors min-w-60 max-w-fit justify-between disabled:cursor-progress"
          >
            <span>
              {selectedRange?.to ? formatDate(selectedRange.to) : "Select Date"}
            </span>
            <ChevronDown size={16} />
          </button>
          {dropdownOpenTwo && selectedRange?.from && (
            <div className="absolute mt-2 w-80 p-4 bg-gray-50 border border-gray-200  shadow-lg z-10">
              <DayPicker
                mode="single"
                selected={selectedRange?.to}
                onSelect={handleSelectTo}
                disabled={[
                  !selectedRange?.from
                    ? () => true
                    : (date) => {
                        const nd = normalizeDate(date);
                        return !availablePeriods.some(
                          (p) =>
                            p.from.getTime() ===
                              selectedRange.from!.getTime() &&
                            p.to.getTime() === nd.getTime()
                        );
                      },
                ]}
                modifiersClassNames={{
                  selected: "bg-yellow text-white rounded-md cursor-pointer",
                }}
                classNames={{
                  disabled: "line-through text-gray-400 cursor-not-allowed",
                  table: "w-full text-center",
                  day: " text-center",
                  day_selected: "bg-yellow text-white hover:bg-teal-700",
                  day_button:
                    " cursor-pointer p-2.5  rounded-md transition-colors",
                  nav: "flex justify-between mb-2",
                  month_caption: "mb-2 text-center",
                  button_next: "cursor-pointer",
                  button_previous: "cursor-pointer",
                }}
              />
            </div>
          )}
        </div>
        <div className="flex p-3 items-center text-white gap-2 border border-yellow   transition-colors min-w-56 max-w-56 justify-between">
          <label>Price</label>
          <div>{price?.rent}</div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
