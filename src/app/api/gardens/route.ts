import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const CreateGardenSchema = z.object({
  name: z.string().min(2),
  region: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
  coordinatesText: z.string().optional(),
  isSelfPick: z.boolean().optional(),
  pricePerKg: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const region = searchParams.get("region")?.trim();
  const sort = searchParams.get("sort")?.trim();

  const orderBy =
    sort === "price"
      ? { pricePerKg: "asc" as const }
      : { name: "asc" as const };

  const gardensRaw = await prisma.garden.findMany({
    orderBy,
    include: { images: true, owner: { select: { name: true } } },
  });

  const qLower = q?.toLowerCase();
  const regionLower = region?.toLowerCase();
  const gardens = gardensRaw.filter((garden) => {
    const name = garden.name.toLowerCase();
    const reg = garden.region.toLowerCase();
    const qOk = qLower ? name.includes(qLower) || reg.includes(qLower) : true;
    const rOk = regionLower ? reg.includes(regionLower) : true;
    return qOk && rOk;
  });

  return NextResponse.json({ gardens });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateGardenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const garden = await prisma.garden.create({
    data: {
      ownerId: session.user.id,
      name: parsed.data.name,
      region: parsed.data.region,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      coordinatesText: parsed.data.coordinatesText,
      isSelfPick: parsed.data.isSelfPick ?? false,
      pricePerKg: parsed.data.pricePerKg,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
    },
  });

  return NextResponse.json({ garden }, { status: 201 });
}
