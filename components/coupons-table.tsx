import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

const CouponDataTable: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [Loading, setLoading] = useState(false);

  // Fetching coupons data from the API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch("/api/coupons");
        const data = await response.json();
        setCoupons(data.coupons); // Assuming response returns coupons in the 'coupons' field
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/coupons/${id}`);
        setCoupons(coupons.filter((coupon) => coupon.id !== id));
        toast.success("Coupon deleted successfully");
      } catch (error) {
        toast.error("Failed to delete Coupon");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="overflow-x-auto p-5 min-h-dvh">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">Coupon</h1>
        <Button asChild>
          <Link href={"/d/a/coupon/c"}>Create</Link>
        </Button>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Status
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Coupon Code
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Discount (%)
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Valid From
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Valid To
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Created At
            </th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                {coupon.isActive ? "Active" : "Inactive"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                {coupon.code}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                {coupon.discount}%
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                {new Date(coupon.from).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                {new Date(coupon.to).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                {new Date(coupon.createdAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                <Button
                  disabled={Loading}
                  onClick={() => handleDelete(coupon.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponDataTable;
