import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const CreateCouponForm: React.FC = () => {
  // Form state
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<number | string>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setError(null);
    setSuccessMessage(null);

    // Validate form data
    if (!code || !discount || !from || !to) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          discount,
          from,
          to,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Coupon created successfully!");
        router.push('/d/a/coupon'); // Redirect to the coupon list or another page
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to create coupon.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg min-h-dvh">
      <h2 className="text-2xl font-semibold text-center mb-4">Create Coupon</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            Coupon Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount (%)
          </label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* From Date */}
        <div className="mb-4">
          <label
            htmlFor="from"
            className="block text-sm font-medium text-gray-700"
          >
            From Date
          </label>
          <input
            type="datetime-local"
            id="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* To Date */}
        <div className="mb-4">
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700"
          >
            To Date
          </label>
          <input
            type="datetime-local"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Create Coupon
        </Button>
      </form>
    </div>
  );
};

export default CreateCouponForm;
