import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coupon: string }> }
) {
  // Get coupon code from the URL parameters
  const { coupon } = await params;

  // Validate if code is provided
  if (!coupon) {
    return NextResponse.json(
      { message: "Coupon code is required" },
      { status: 400 }
    );
  }

  try {
    // Find the coupon by code
    const coupons = await prisma.coupon.findUnique({
      where: {
        code: coupon, // Search coupon by code
      },
    });

    // If no coupon found, return 404
    if (!coupons) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );
    }
    // Check if the coupon is expired
    const now = new Date();
    if (now >= coupons.expiration || !coupons.isActive) {
      return NextResponse.json(
        { message: "Coupon is expired" },
        { status: 400 }
      );
    }
    // Return the coupon details
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
