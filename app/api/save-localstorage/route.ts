import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { localStorageValue } = await req.json(); // Parse the incoming JSON request body
    console.log(localStorageValue, "localStorageValue:");
    if (!localStorageValue) {
      return NextResponse.json(
        { error: "localStorageValue is required" },
        { status: 400 }
      );
    }

    // Set cookie in the response using the `cookies` method from next/headers
    const response = NextResponse.json({
      message: "localStorage value saved successfully",
    });

    // Set the cookie with HttpOnly, Max-Age, SameSite flags
    response.cookies.set("localStorageValue", localStorageValue, {
      path: "/",
      httpOnly: true,
      maxAge: 3600, // Expires in 1 hour
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
