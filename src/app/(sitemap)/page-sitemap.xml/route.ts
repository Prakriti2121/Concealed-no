import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { sitemapTemplate, rowsTemplate, formatUTC } from "@/app/utils/sitemapUtils";

export async function GET() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_BASE_URL!;

  const pages = await prisma.page.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, lastmod: formatUTC(new Date()) },
    { url: `${baseUrl}/viinit-luettelo`, lastmod: formatUTC(new Date()) },
    { url: `${baseUrl}/ota-yhteytta`, lastmod: formatUTC(new Date()) },

    { url: `${baseUrl}/yrityksen-profiili`, lastmod: formatUTC(new Date()) },
    { url: `${baseUrl}/in-english`, lastmod: formatUTC(new Date()) },
    { url: `${baseUrl}/tiimimme`, lastmod: formatUTC(new Date()) },
  ];

  // Dynamic pages - filtering out pages that already have dedicated routes
  const dynamicPages = pages
    .filter(
      (page) => !staticPages.some((sp) => sp.url.endsWith(`/${page.slug}`))
    )
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastmod: formatUTC(page.updatedAt),
    }));

  const allPages = [...staticPages, ...dynamicPages];
  const rows = rowsTemplate(allPages);
  const html = sitemapTemplate(rows, allPages.length);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
