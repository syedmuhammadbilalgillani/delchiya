import { PrismaClient } from "@/app/generated/prisma";
export const runtime = 'nodejs';

const prisma = new PrismaClient();

export async function createBooking(data: any) {
  return await prisma.booking.create({
    data,
  });
}
