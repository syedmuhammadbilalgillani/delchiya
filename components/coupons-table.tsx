import React, { useEffect, useState } from 'react';

const CouponDataTable: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);

  // Fetching coupons data from the API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('/api/coupons');
        const data = await response.json();
        setCoupons(data.coupons);  // Assuming response returns coupons in the 'coupons' field
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">Coupon Code</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">Discount (%)</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">Expiration Date</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 border-b">{coupon.code}</td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">{coupon.discount}</td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">{new Date(coupon.expiration).toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b">{new Date(coupon.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponDataTable;
