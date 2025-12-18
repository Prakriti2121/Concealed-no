import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params promise to get the id
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedId = Number.parseInt(id, 10);
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
  }

  try {
    const page = await prisma.page.findUnique({
      where: { id: parsedId },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ error: "Error fetching page" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params promise to extract the id
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedId = Number.parseInt(id, 10);
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const updatedPage = await prisma.page.update({
      where: { id: parsedId },
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/ /g, "-"),
        seoTitle: body.seoTitle,
        metaDesc: body.metaDesc,
        canonicalUrl: body.canonicalUrl,
        content: body.content,
        author: body.author,
        featuredImage: body.featuredImage || null,
        published: body.published ?? false,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params promise to extract the id
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedId = Number.parseInt(id, 10);
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
  }

  try {
    await prisma.page.delete({ where: { id: parsedId } });
    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
