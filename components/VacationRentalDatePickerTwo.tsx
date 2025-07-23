"use client";
import axios from "axios";
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

const VacationRentalDatePickerTwo: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [availablePeriods, setAvailablePeriods] = useState<AvailablePeriod[]>(
    []
  );
  const [fromDates, setFromDates] = useState<Date[]>([]);
  const [toDates, setToDates] = useState<Date[]>([]);
  const [price, setPrice] = useState<Pricing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  // Determine if a date is selectable
  const isDateSelectable = (date: Date): boolean => {
    const normalizedDate = normalizeDate(date);

    if (!selectedRange?.from) {
      // Only allow from dates initially
      return fromDates.some((d) => d.getTime() === normalizedDate.getTime());
    }

    // Allow to dates that correspond to the selected from date
    const normalizedFrom = normalizeDate(selectedRange.from);
    return availablePeriods.some(
      (period) =>
        period.from.getTime() === normalizedFrom.getTime() &&
        period.to.getTime() === normalizedDate.getTime()
    );
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedRange(undefined);
    setPrice(null);
    setError(null);
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

      <div className="grid grid-cols-1  gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Select Your Dates
          </h2>
          {/* Check-in calendar */}
          <div className="grid grid-cols-2">
            <div>
              <h3>Choose your check-in</h3>
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
                  selected: "bg-teal-500 text-white rounded-md",
                }}
                classNames={{
                  disabled: "line-through text-gray-200 cursor-not-allowed ",
                }}
              />
            </div>

            {/* Check-out calendar */}
            <div>
              <h3>Then choose your check-out</h3>
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
                  selected: "bg-gray-500 text-white rounded-md",
                }}
                classNames={{
                  disabled: "line-through text-gray-200 cursor-not-allowed",
                }}
              />
            </div>
          </div>

          <div className="mt-4   text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded"></div>
              <span>Check-in dates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-coral-500 rounded"></div>
              <span>Check-out dates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Selected dates</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {selectedRange?.from && (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Your Selection
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Check-in:</span>{" "}
                    {formatDate(selectedRange.from)}
                  </p>
                  {selectedRange.to && (
                    <>
                      <p>
                        <span className="font-medium">Check-out:</span>{" "}
                        {formatDate(selectedRange.to)}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {Math.ceil(
                          (selectedRange.to.getTime() -
                            selectedRange.from.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        nights
                      </p>
                      {price && (
                        <p>
                          <span className="font-medium">Price:</span>{" "}
                          {price.currency} {price.rent.toLocaleString()}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={clearSelection}
                    className={`px-4 py-2 rounded text-white transition-colors text-sm ${
                      selectedRange?.from
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!selectedRange?.from || isLoading}
                  >
                    Clear Selection
                  </button>
                  {selectedRange.to && (
                    <button
                      onClick={() => alert("Booking confirmed!")} // Replace with actual booking logic
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                      disabled={isLoading || !price}
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </>
            )}
            <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-800">
              Available Periods
            </h3>
            <div className="space-y-3 h-[40dvh] overflow-auto">
              {availablePeriods.map((period, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium">
                    {formatDate(period.from)} → {formatDate(period.to)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {period.originalData.period.nights} nights •{" "}
                    {period.originalData.pricing.currency}{" "}
                    {period.originalData.pricing.total_excl_deposit.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Instructions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Select a check-in date (teal) to see available check-out dates
            (coral).
          </li>
          <li>
            Pricing will be displayed automatically upon selecting valid dates.
          </li>
          <li>Only highlighted dates are available for booking.</li>
          <li>Click "Book Now" to confirm your booking.</li>
        </ul>
      </div>
    </div>
  );
};

export default VacationRentalDatePickerTwo;
