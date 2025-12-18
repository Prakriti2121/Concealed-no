import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import {
  sitemapTemplate,
  rowsTemplate,
  formatUTC,
} from "@/app/utils/sitemapUtils";

export async function GET() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_BASE_URL!;

  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  const wineUrls = products.map((product) => ({
    url: `${baseUrl}/viineja-luettelo/viinit/${product.slug}`,
    lastmod: formatUTC(product.updatedAt),
  }));

  const rows = rowsTemplate(wineUrls);
  const html = sitemapTemplate(rows, wineUrls.length);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
