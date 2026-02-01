import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs/promises";
import path from "path";

const UpdateGardenSchema = z.object({
  name: z.string().min(2).optional(),
  region: z.string().min(2).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  coordinatesText: z.string().optional(),
  isSelfPick: z.boolean().optional(),
  pricePerKg: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const garden = await prisma.garden.findUnique({
    where: { id },
    include: { images: true, owner: { select: { name: true } } },
  });

  if (!garden) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ garden });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const garden = await prisma.garden.findUnique({ where: { id } });
  if (!garden) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (garden.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = UpdateGardenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await prisma.garden.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ garden: updated });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const garden = await prisma.garden.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!garden) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (garden.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.gardenImage.deleteMany({ where: { gardenId: id } });
  await prisma.garden.delete({ where: { id } });

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await Promise.all(
    garden.images.map(async (img) => {
      const filePath = path.join(process.cwd(), "public", img.url);
      try {
        await fs.unlink(filePath);
      } catch {
        // ignore missing files
      }
    })
  );

  return NextResponse.json({ ok: true });
}
