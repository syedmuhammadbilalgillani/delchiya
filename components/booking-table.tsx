// app/bookings/BookingsTable.tsx
"use client";

import { useState } from "react";
import Logout from "@/components/logout";
import { Button } from "./ui/button";
import CreateCouponForm from "./create-coupons-form";
import CouponDataTable from "./coupons-table";

interface Booking {
  id: number;
  house_id: number;
  language: number;
  type: string;
  arrival: Date;
  departure: Date;
  company_name: string;
  vat_identification_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  city: string;
  address: string;
  postal_code: string;
  country: string;
  children: string;
  adult: string;
  lindCount: string;
  currency_code: number;
  bedlinen_amount: number;
  cleaning_included: boolean;
  comment: string;
  discount_code: string;
  active_status: boolean;
  is_discounted: boolean;
  created_at: Date;
}

const BookingModal = ({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) => {
  if (!booking) return null;
  // Close modal when clicking on overlay (outside the content)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to overlay
      >
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="space-y-2">
            <DetailItem label="Booking ID" value={booking.id} />
            <DetailItem label="House ID" value={booking.house_id} />
            <DetailItem label="Language" value={booking.language} />
            <DetailItem label="Type" value={booking.type} />
            <DetailItem
              label="Arrival"
              value={new Date(booking.arrival).toLocaleString()}
            />
            <DetailItem
              label="Departure"
              value={new Date(booking.departure).toLocaleString()}
            />
            <DetailItem label="Company" value={booking.company_name} />
            <DetailItem
              label="VAT Number"
              value={booking.vat_identification_number}
            />
            <DetailItem label="First Name" value={booking.first_name} />
            <DetailItem label="Last Name" value={booking.last_name} />
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <DetailItem label="Email" value={booking.email} />
            <DetailItem label="Phone" value={booking.phone} />
            <DetailItem label="Mobile" value={booking.mobile} />
            <DetailItem
              label="Address"
              value={`${booking.address}, ${booking.city}`}
            />
            <DetailItem label="Postal Code" value={booking.postal_code} />
            <DetailItem label="Country" value={booking.country} />
            <DetailItem label="Currency Code" value={booking.currency_code} />
            <DetailItem
              label="Bedlinen Amount"
              value={booking.bedlinen_amount}
            />
            <DetailItem label="Adult" value={booking.adult} />
            <DetailItem label="Children" value={booking.children} />
            <DetailItem label="Lined Count" value={booking.lindCount} />
            <DetailItem
              label="Cleaning Included"
              value={booking.cleaning_included ? "Yes" : "No"}
            />
            <DetailItem
              label="Active Status"
              value={booking.active_status ? "Active" : "Inactive"}
            />
            <DetailItem
              label="Created At"
              value={new Date(booking.created_at).toLocaleString()}
            />
          </div>
        </div>

        {/* Comment - Full width */}
        {booking.comment && (
          <div className="mt-4">
            <h3 className="font-semibold">Comment:</h3>
            <p className="mt-1 p-2 bg-gray-50 rounded">{booking.comment}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Helper component for consistent detail item styling
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <span className="font-semibold">{label}:</span> {value || "-"}
  </div>
);
const DataTable = ({
  bookings,
  onRowClick,
}: {
  bookings: Booking[];
  onRowClick: (booking: Booking) => void;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">code</th>
            <th className="py-2 px-4 border-b">coupon</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                {booking.first_name} {booking.last_name}
              </td>
              <td className="py-2 px-4 border-b">{booking.email}</td>
              <td className="py-2 px-4 border-b">{booking.phone || "-"}</td>
              <td className="py-2 px-4 border-b">
                {booking.discount_code || "-"}
              </td>
              <td className="py-2 px-4 border-b">
                {booking.is_discounted ? "true" : "false"}
              </td>
              <td className="py-2 px-4 border-b">
                <Button onClick={() => onRowClick(booking)}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function BookingsTable({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className=" w-full p-8 mt-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">Bookings</h1>
        <Logout />
      </div>
      <CreateCouponForm />
      <CouponDataTable />
      <div className="bg-white p-6 rounded-lg shadow">
        {initialBookings.length > 0 ? (
          <DataTable
            bookings={initialBookings}
            onRowClick={(booking) => setSelectedBooking(booking)}
          />
        ) : (
          <p>No bookings found</p>
        )}
      </div>

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
