import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Error fetching pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const page = await prisma.page.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/ /g, "-"),
        seoTitle: body.seoTitle,
        metaDesc: body.metaDesc,
        canonicalUrl: body.canonicalUrl,
        content: body.content,
        author: body.author || "Unknown",
        featuredImage: body.featuredImage || null,
        published: body.published ?? false,
      },
    });
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error(
      "Error creating page:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json({ error: "Error creating page" }, { status: 500 });
  }
}
