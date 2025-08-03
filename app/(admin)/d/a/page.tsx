// app/bookings/page.tsx
import { BookingsTable } from "@/components/booking-table";
import prisma from "@/lib/prisma";

const Page = async () => {
  const bookings = await prisma.booking.findMany();
  return <BookingsTable initialBookings={bookings} />;
};

export default Page;