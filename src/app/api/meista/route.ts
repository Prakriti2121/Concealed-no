import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { id: 11 },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: page.title,
      seoTitle: page.seoTitle,
      content: page.content,
      featuredImage: page.featuredImage,
      canonicalUrl: page.canonicalUrl,
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ error: "Error fetching page" }, { status: 500 });
  }
}
