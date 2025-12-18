import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a Single Banner by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const bannerId = Number.parseInt(id, 10);
  if (isNaN(bannerId)) {
    return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
  }

  try {
    const banner = await prisma.banner.findUnique({
      where: { id: bannerId },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Error fetching banner" },
      { status: 500 }
    );
  }
}

// UPDATE a Banner
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const bannerId = Number.parseInt(id, 10);
  if (isNaN(bannerId)) {
    return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
  }

  try {
    const { title, link, image, description } = await req.json();

    // Validation that requires at least one field
    if (!title && !link && !image && !description) {
      return NextResponse.json(
        { error: "At least one banner field is required" },
        { status: 400 }
      );
    }

    const updatedBanner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        title: title || null,
        link: link || null,
        image: image || null,
        description: description || null,
      },
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE a Banner
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const bannerId = Number.parseInt(id, 10);
  if (isNaN(bannerId)) {
    return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
  }

  try {
    await prisma.banner.delete({ where: { id: bannerId } });
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
