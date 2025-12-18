import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { sitemapTemplate, rowsTemplate, formatUTC } from "@/app/utils/sitemapUtils";

export async function GET() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_BASE_URL!;

  const teamMembers = await prisma.teamMember.findMany({
    select: { id: true, updatedAt: true },
  });

  const teamUrls = teamMembers.map((member) => ({
    url: `${baseUrl}/tiimimme/${member.id}`,
    lastmod: formatUTC(member.updatedAt),
  }));

  const rows = rowsTemplate(teamUrls);
  const html = sitemapTemplate(rows, teamUrls.length);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
