import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "yrityksen-profiili" },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: page.title,
      content: page.content,
      seoTitle: page.seoTitle,
      metaDesc: page.metaDesc,
      canonicalUrl: page.canonicalUrl,
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ error: "Error fetching page" }, { status: 500 });
  }
}
