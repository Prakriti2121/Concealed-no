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

  const customPostUrls = [
    {
      url: `${baseUrl}/spucpt/popups-example/`,
      lastmod: formatUTC(new Date()),
    },
  ];

  const rows = rowsTemplate(customPostUrls);
  const html = sitemapTemplate(rows, customPostUrls.length);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
