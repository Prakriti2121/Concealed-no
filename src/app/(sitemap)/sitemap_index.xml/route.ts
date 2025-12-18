import { NextResponse } from "next/server";
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

  const sitemaps = [
    {
      url: `${baseUrl}/page-sitemap.xml`,
      lastmod: formatUTC(new Date()),
    },
    {
      url: `${baseUrl}/attachment-sitemap.xml`,
      lastmod: formatUTC(new Date()),
    },
    {
      url: `${baseUrl}/spucpt-sitemap.xml`,
      lastmod: formatUTC(new Date()),
    },
    {
      url: `${baseUrl}/wines-sitemap.xml`,
      lastmod: formatUTC(new Date()),
    },
  ];

  const rows = rowsTemplate(sitemaps);
  const html = sitemapTemplate(rows, sitemaps.length, true);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
