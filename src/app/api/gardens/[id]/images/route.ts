import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(
  request: Request,
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

  const formData = await request.formData();
  const files = formData.getAll("images");
  if (files.length === 0) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const created = [];
  for (const file of files) {
    if (!(file instanceof File)) continue;
    if (!file.type.startsWith("image/")) continue;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${id}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${ext}`;
    const relativeUrl = `/uploads/${filename}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    created.push({ gardenId: id, url: relativeUrl });
  }

  if (created.length > 0) {
    await prisma.gardenImage.createMany({ data: created });
  }

  return NextResponse.json({ ok: true, count: created.length });
}
