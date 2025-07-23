"use client";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

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

const VacationRentalDatePicker: React.FC = () => {
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
  useEffect(() => {
    if (selectedRange?.from && selectedRange?.to) {
      const fetchPrice = async () => {
        setIsLoading(true);
        setError(null);
        setPrice(null);

        const normalizedFrom = normalizeDate(selectedRange.from);
        const normalizedTo = normalizeDate(selectedRange.to);
        const matchingPeriod = availablePeriods.find(
          (p) =>
            p.from.getTime() === normalizedFrom.getTime() &&
            p.to.getTime() === normalizedTo.getTime()
        );

        if (!matchingPeriod) {
          setError("Invalid date range selected.");
          setIsLoading(false);
          return;
        }

        const formatLocalDate = (date: Date) =>
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;

        const bookingRequest = {
          from_date: formatLocalDate(normalizedFrom),
          to_date: formatLocalDate(normalizedTo),
          house_id: matchingPeriod.originalData.house.id,
          nights: matchingPeriod.originalData.period.nights,
          timestamp: new Date().toISOString(),
        };

        try {
          const response = await axios.get(
            `https://api.villavilla.com/partner-api/v1/period?house_id=${bookingRequest.house_id}&arrival=${bookingRequest.from_date}&departure=${bookingRequest.to_date}&currency_code=208`,
            {
              headers: {
                Authorization:
                  "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
              },
            }
          );
          setPrice(response.data.pricing);
        } catch (error) {
          setError("Failed to fetch pricing data. Please try again.");
          console.error("Error fetching price:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPrice();
    }
  }, [selectedRange, availablePeriods]);

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
    if (!date || !selectedRange?.from) return;
    const d = normalizeDate(date);
    const match = availablePeriods.find(
      (p) =>
        p.from.getTime() === selectedRange.from!.getTime() &&
        p.to.getTime() === d.getTime()
    );
    if (!match) return;
    setSelectedRange({ from: selectedRange.from, to: d });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        Vacation Rental Booking
      </h1>
      <p className="text-gray-600 mb-6">
        {availablePeriods[0]?.originalData.house.place_name},{" "}
        {availablePeriods[0]?.originalData.house.country.name}
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 underline text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          Loading...
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Select Your Dates
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Check-in dropdown */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Check-in Date
              </h3>
              <div className="relative w-full">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-4 py-2 w-full border border-gray-300 rounded-md bg-teal-500 hover:bg-teal-600 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-colors"
                >
                  <span>
                    {selectedRange?.from
                      ? formatDate(selectedRange.from)
                      : "Select Date"}
                  </span>
                  <ChevronDown size={16} />
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-2 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <DayPicker
                      mode="single"
                      selected={selectedRange?.from}
                      onSelect={handleSelectFrom}
                      disabled={[
                        { before: new Date() },
                        (date) =>
                          !fromDates.some(
                            (fd) =>
                              fd.getTime() === normalizeDate(date).getTime()
                          ),
                      ]}
                      modifiersClassNames={{
                        selected: "bg-teal-500 text-white rounded-md",
                      }}
                      classNames={{
                        disabled:
                          "line-through text-gray-300 cursor-not-allowed",
                        table: "w-full",
                        day: "hover:bg-gray-100 rounded-md transition-colors",
                        day_selected:
                          "bg-teal-500 text-white hover:bg-teal-600",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Check-out dropdown */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Check-out Date
              </h3>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpenTwo(!dropdownOpenTwo)}
                  className="px-4 py-2 w-full border border-gray-300 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors"
                >
                  <span>
                    {selectedRange?.to
                      ? formatDate(selectedRange.to)
                      : "Select Date"}
                  </span>
                  <ChevronDown size={16} />
                </button>
                {dropdownOpenTwo && selectedRange?.from && (
                  <div className="absolute mt-2 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
                        selected: "bg-orange-500 text-white rounded-md",
                      }}
                      classNames={{
                        disabled:
                          "line-through text-gray-300 cursor-not-allowed",
                        table: "w-full",
                        day: "hover:bg-gray-100 rounded-md transition-colors",
                        day_selected:
                          "bg-orange-500 text-white hover:bg-orange-600",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedRange?.from && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Your Selection
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Check-in:</span>
                  <span className="text-gray-900">
                    {formatDate(selectedRange.from)}
                  </span>
                </div>
                {selectedRange.to && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Check-out:
                      </span>
                      <span className="text-gray-900">
                        {formatDate(selectedRange.to)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Duration:
                      </span>
                      <span className="text-gray-900">
                        {Math.ceil(
                          (selectedRange.to.getTime() -
                            selectedRange.from.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        nights
                      </span>
                    </div>
                    {price && (
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">
                          Total Price:
                        </span>
                        <span className="font-bold text-lg text-green-600">
                          {price.currency} {price.rent.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => setSelectedRange(undefined)}
                  className={`px-4 py-2 rounded-md text-white transition-colors text-sm font-medium ${
                    selectedRange?.from
                      ? "bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!selectedRange?.from || isLoading}
                >
                  Clear Selection
                </button>
                {selectedRange.to && (
                  <button
                    onClick={() => alert("Booking confirmed!")}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm font-medium"
                    disabled={isLoading || !price}
                  >
                    {isLoading ? "Processing..." : "Book Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacationRentalDatePicker;
