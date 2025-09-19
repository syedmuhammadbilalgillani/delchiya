import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Initialize Prisma Client

export async function POST(request: NextRequest) {
  // Parse request body
  const { code, discount, from, to } = await request.json();

  // Validate input
  if (!code || !discount || !from || !to) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Create a new coupon in the database
    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discount: parseFloat(discount),
        from: new Date(from), // Start date
        to: new Date(to),     // End date
      },
    });

    return NextResponse.json(
      { message: "Coupon created successfully", coupon: newCoupon },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Prisma query to fetch coupons
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: "desc", // Order by creation date
      },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching coupons" },
      { status: 500 }
    );
  }
}
