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
    const couponData = await prisma.coupon.findUnique({
      where: {
        code: coupon, // Search coupon by code
      },
    });

    // If no coupon found, return 404
    if (!couponData) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );
    }

    // Get current date
    const now = new Date();

    // Check if the coupon is active
    if (!couponData.isActive) {
      return NextResponse.json(
        { message: "Coupon is inactive" },
        { status: 400 }
      );
    }

    // Check if the coupon is expired
    if (now < new Date(couponData.from) || now > new Date(couponData.to)) {
      return NextResponse.json(
        { message: "Coupon is expired" },
        { status: 400 }
      );
    }

    // Return the coupon details if both checks pass
    return NextResponse.json({ coupon: couponData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,

  { params }: { params: Promise<{ coupon: string }> }
) {
  const { coupon } = await params; // Get the query param

  try {
    await prisma.coupon.delete({
      where: { id: Number(coupon) },
    });
    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete the Coupon,${error}` },
      { status: 500 }
    );
  }
}
