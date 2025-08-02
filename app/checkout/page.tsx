// "use client";
// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
// );

// export default function CheckoutButton() {
//   const [loading, setLoading] = useState(false);

//   const bookingData = {
//     house_id: "A1",
//     arrival: "2025-08-01",
//     departure: "2025-08-05",
//     first_name: "John",
//     last_name: "Doe",
//     email: "john@example.com",
//     // Add other booking details here
//   };

//   const handleCheckout = async () => {
//     setLoading(true);
//     const res = await fetch("/api/checkout_sessions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: 2000, bookingData }), // $20.00
//     });

//     const { id } = await res.json();
//     const stripe = await stripePromise;
//     if (stripe && id) {
//       await stripe.redirectToCheckout({ sessionId: id });
//     }
//     setLoading(false);
//   };

//   return (
//     <div className=" flex justify-center items-center h-dvh">
//       <button
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//         onClick={handleCheckout}
//         disabled={loading}
//       >
//         {loading ? "Redirecting..." : "Book & Pay"}
//       </button>
//       <button
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//         onClick={handleCheckout}
//         disabled={loading}
//       >
//         {loading ? "Redirecting..." : "Book & Pay"}
//       </button>
//       <button
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//         onClick={handleCheckout}
//         disabled={loading}
//       >
//         {loading ? "Redirecting..." : "Book & Pay"}
//       </button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/store/useRoom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const CheckoutForm = () => {
  const {
    adults,
    children,
    linnedCount,
    linnedChecked,
    basePrice,
    rengoring,
    checkin: storeCheckin,
    checkout: storeCheckout,
    setAdults,
    setChildren,
    setLinnedCount,
    setLinnedChecked,
    setBasePrice,
    setRengoring,
    totalPrice,
    setCheckin,
    setCheckout,
  } = useRoomStore();

  const [formData, setFormData] = useState({
    house_id: 122,
    language: 5,
    type: "private",
    arrival: storeCheckin,
    departure: storeCheckout,
    company_name: "",
    vat_identification_number: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    mobile: "",
    city: "",
    address: "",
    postal_code: "",
    country: "DKK",
    currency_code: 208,
    bedlinen_amount: 0,
    cleaning_included: true,
    comment: "",
    active_status: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const stripe = await stripePromise;

  //   const response = await fetch("/api/checkout_sessions", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ amount: 2000, bookingData: formData }),
  //   });

  //   const { id } = await response.json();

  //   const { error } = await stripe.redirectToCheckout({ sessionId: id });

  //   if (error) console.error(error);
  // };
  const handleSubmit = async (e: any) => {
    // setLoading(true);
    e.preventDefault();
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalPrice, bookingData: formData }), // $20.00
    });

    const { id } = await res.json();
    const stripe = await stripePromise;
    if (stripe && id) {
      await stripe.redirectToCheckout({ sessionId: id });
    }
    // setLoading(false);
  };
  if (!totalPrice) return notFound();

  return (
    <div className="mt-24 main">
      <h1 className="text-xl font-semibold mb-4">Contact information</h1>
      <p>
        We'll use this email to send you details and updates about your order.
      </p>
      <div className="grid md:grid-cols-12 grid-cols-1">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 col-span-8 grid grid-cols-2 pt-3 gap-5"
        >
          {/* <Input
          name="house_id"
          value={formData.house_id}
          onChange={handleChange}
          placeholder="House ID"
          required
        /> */}
          {/* <Input
          name="arrival"
          value={formData.arrival}
          onChange={handleChange}
          placeholder="Arrival Date (YYYY-MM-DD)"
          required
        />
        <Input
          name="departure"
          value={formData.departure}
          onChange={handleChange}
          placeholder="Departure Date (YYYY-MM-DD)"
          required
        /> */}
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <Input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile (optional)"
          />
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <Input
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="Postal Code"
            required
          />
          <Input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country (ISO 2-letter)"
            required
          />
          <Input
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Company Name (if applicable)"
          />
          <Input
            name="vat_identification_number"
            value={formData.vat_identification_number}
            onChange={handleChange}
            placeholder="VAT Number (if applicable)"
          />
          <Input
            name="currency_code"
            type="number"
            value={formData.currency_code}
            onChange={handleChange}
            placeholder="Currency Code (e.g., 978)"
            required
          />
          <Input
            name="bedlinen_amount"
            type="number"
            value={formData.bedlinen_amount}
            onChange={handleChange}
            placeholder="Bed Linen Amount"
            required
          />
          {/* <div className="flex items-center space-x-2">
          <Checkbox
            id="cleaning_included"
            checked={formData.cleaning_included}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                cleaning_included: Boolean(checked),
              }))
            }
          />
          <label htmlFor="cleaning_included">Include Cleaning</label>
        </div> */}
          <Textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="col-span-2"
            placeholder="Comment (optional)"
          />
          <Button type="submit">Checkout</Button>
        </form>
        <div className="col-span-4  px-5 py-3">
          <div className="border border-gray-300 rounded  px-5 py-3">
            <div>Order summary</div>
            <div className="flex justify-start items-center mt-2">
              <div className="flex items-center space-x-2">
                <img
                  src="/placeholder.png"
                  className="size-12 border rounded-full"
                  alt=""
                />
                <div>
                  <h3>Blommehuset</h3>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-dashed py-3 mt-3">
              <label>Total Base Price</label>
              <div>{basePrice ?? 0} kr.</div>
            </div>
            <div className="flex justify-between border-t border-dashed py-3">
              <label>Extra Services Price</label>
              <div>{`${linnedChecked ? linnedCount * 135 : "0"} kr.`}</div>
            </div>
            <div className="flex justify-between border-t border-dashed py-3">
              <label>Rengøring</label>
              <div>{rengoring ? "1800 kr." : "0"}</div>
            </div>
            <div className="flex justify-between border-y border-dashed py-3">
              <label>Total Price</label>
              <div>{totalPrice} kr.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
