import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gardens = await prisma.garden.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      region: true,
      pricePerKg: true,
      latitude: true,
      longitude: true,
      coordinatesText: true,
      isSelfPick: true,
      contactPhone: true,
      contactEmail: true,
      images: true,
    },
  });

  return NextResponse.json({ gardens });
}
