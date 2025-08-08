"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/store/useRoom";
import { notFound } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    totalPrice,
    setTotalPrice,
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
    bedlinen_amount: linnedCount,
    cleaning_included: true,
    comment: "",
    active_status: false,
    adult: String(adults),
    children: String(children),
    lindCount: String(135 * linnedCount),
  });
  const [coupon, setcoupon] = useState("");
  const [discount, setdiscount] = useState(0);
  const [oldPrice, setoldPrice] = useState(0);
  const [discounted, setdiscounted] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "city",
      "address",
      "postal_code",
      "country",
      "currency_code",
      // "bedlinen_amount",
    ];

    for (let field of requiredFields) {
      if (!(formData as any)[field]) {
        alert(`Please fill in the ${field.replace("_", " ")} field.`);
        return false;
      }
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: any) => {
    // debugger;
    e.preventDefault();
    if (!validateForm()) return;
    console.log("CheckoutForm - Room Store Values:", {
      adults,
      children,
      linnedCount,
    });
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isDiscounted: discounted,
        discountCode: coupon,
        amount: totalPrice * 100,
        bookingData: formData,
      }),
    });
    setcoupon("");
    setdiscounted(false);
    setdiscount(0);
    const { id } = await res.json();
    const stripe = await stripePromise;
    if (stripe && id) {
      await stripe.redirectToCheckout({ sessionId: id });
    }
  };
  const applyCoupon = async (couponCode: string) => {
    if (!couponCode) return;
    try {
      setisLoading(true);
      const res = await axios.get(`/api/coupons/${couponCode}`);
      const data = res?.data;
      console.log(data?.coupons, "data for coupon");
      if (data.coupons && data.coupons.discount) {
        setdiscount(data.coupons.discount);
        // debugger;
        setoldPrice(totalPrice);
        const newPrice = Math.max(
          Math.round(totalPrice * (1 - data?.coupons?.discount / 100)),
          0
        );
        setdiscounted(true);
        setTotalPrice(newPrice);
        console.log(totalPrice, "total prices");
      } else {
        toast.error(data.data.message);
      }
      setisLoading(false);
    } catch (error: any) {
      setisLoading(false);
      // console.error("Error applying coupon:", error);
      toast.error(error?.response?.data?.message);
    }
  };
  console.log(totalPrice, "totalPricetotalPrice");
  if (!totalPrice) return notFound();

  return (
    <div className="mt-24 main">
      <div className="col-span-4 md:hidden block px-5 py-3">
        <div className="border border-gray-300 rounded px-5 py-3">
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
            <div>{rengoring || "0"}</div>
          </div>
          <div className="flex justify-between border-y border-dashed py-3">
            <label>Total Price</label>

            <div>
              {discount > 0 ? (
                <>
                  <span
                    style={{ textDecoration: "line-through", color: "gray" }}
                  >
                    {oldPrice} kr.
                  </span>{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {totalPrice} kr.
                  </span>
                </>
              ) : (
                <span>{totalPrice} kr.</span>
              )}
            </div>
          </div>
          <div className="">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="coupon"
            >
              Coupon Code (optional)
            </label>
            <Input
              id="coupon"
              name="coupon"
              value={coupon}
              onChange={(e) => setcoupon(e.target.value)}
              placeholder="Enter coupon code"
            />
            <Button
              disabled={isLoading || discounted}
              className="flex-1 w-full bg-green rounded-none hover:bg-yellow "
              type="button"
              onClick={() => applyCoupon(coupon)}
            >
              {isLoading && <Loader2 className="animate-spin" />}Apply Coupon
            </Button>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold mb-4">Contact information</h1>
      <p>
        We'll use this email to send you details and updates about your order.
      </p>

      <div className="grid md:grid-cols-12 grid-cols-1">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 col-span-8 grid grid-cols-2 pt-3 gap-5"
        >
          {[
            { label: "First Name", name: "first_name" },
            { label: "Last Name", name: "last_name" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone" },
            { label: "Mobile (optional)", name: "mobile" },
            { label: "City", name: "city" },
            { label: "Address", name: "address" },
            { label: "Postal Code", name: "postal_code" },
            { label: "Country", name: "country" },
            { label: "Company Name (optional)", name: "company_name" },
            {
              label: "VAT Number (optional)",
              name: "vat_identification_number",
            },
            { label: "Currency Code", name: "currency_code", type: "number" },
            // {
            //   label: "Bed Linen Amount",
            //   name: "bedlinen_amount",
            //   type: "number",
            // },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor={name}
              >
                {label}
              </label>
              <Input
                id={name}
                name={name}
                type={type || "text"}
                value={
                  typeof formData[name as keyof typeof formData] === "boolean"
                    ? ""
                    : (formData[name as keyof typeof formData] as
                        | string
                        | number
                        | undefined) ?? ""
                }
                readOnly={name === "currency_code"}
                disabled={name === "currency_code"}
                onChange={handleChange}
                required={!label.toLowerCase().includes("optional")}
              />
            </div>
          ))}

          <div className="col-span-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="comment"
            >
              Comment (optional)
            </label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Comment (optional)"
            />
          </div>

          <Button type="submit">Checkout</Button>
        </form>

        <div className="col-span-4 hidden md:block px-5 py-3">
          <div className="border border-gray-300 rounded px-5 py-3">
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
              <div>{rengoring || "0"}</div>
            </div>

            <div className="flex justify-between border-y border-dashed py-3">
              <label>Total Price</label>
              <div>
                {discount > 0 ? (
                  <>
                    <span
                      style={{ textDecoration: "line-through", color: "gray" }}
                    >
                      {oldPrice} kr.
                    </span>{" "}
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {totalPrice} kr.
                    </span>
                  </>
                ) : (
                  <span>{totalPrice} kr.</span>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="coupon"
              >
                Coupon Code (optional)
              </label>
              <Input
                id="coupon"
                name="coupon"
                value={coupon}
                onChange={(e) => setcoupon(e.target.value)}
                placeholder="Enter coupon code"
              />
              <Button
                className="flex-1 w-full bg-green rounded-none hover:bg-yellow "
                type="button"
                onClick={() => applyCoupon(coupon)}
              >
                {isLoading && <Loader2 className="animate-spin" />}Apply Coupon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
