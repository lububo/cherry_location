import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ imageId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageId } = await context.params;
  const image = await prisma.gardenImage.findUnique({
    where: { id: imageId },
    include: { garden: true },
  });
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (image.garden.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.gardenImage.delete({ where: { id: imageId } });

  const filePath = path.join(process.cwd(), "public", image.url);
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore missing files
  }

  return NextResponse.json({ ok: true });
}
